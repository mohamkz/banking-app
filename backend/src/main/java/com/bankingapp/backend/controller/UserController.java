package com.bankingapp.backend.controller;

import com.bankingapp.backend.dto.ChangePasswordDTO;
import com.bankingapp.backend.dto.UpdateUserInfoDTO;
import com.bankingapp.backend.dto.UserInfoDTO;
import com.bankingapp.backend.model.User;
import com.bankingapp.backend.repository.UserRepository;
import com.bankingapp.backend.security.JwtTokenUtil;
import com.bankingapp.backend.service.TokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            JwtTokenUtil jwtTokenUtil,
            TokenBlacklistService tokenBlacklistService,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.tokenBlacklistService = tokenBlacklistService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getCurrentUser(HttpServletRequest request) {
        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String jwtToken = authorizationHeader.substring(7);

        if (tokenBlacklistService.isTokenBlacklisted(jwtToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtTokenUtil.extractEmail(jwtToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(new UserInfoDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<UserInfoDTO> updateUserInfo(
            HttpServletRequest request,
            @RequestBody UpdateUserInfoDTO updateUserInfoDTO) {
        User user = getAuthenticatedUser(request);

        if (updateUserInfoDTO.firstName() != null && !updateUserInfoDTO.firstName().trim().isEmpty()) {
            user.setFirstName(updateUserInfoDTO.firstName().trim());
        }
        if (updateUserInfoDTO.lastName() != null && !updateUserInfoDTO.lastName().trim().isEmpty()) {
            user.setLastName(updateUserInfoDTO.lastName().trim());
        }
        if (updateUserInfoDTO.phoneNumber() != null && !updateUserInfoDTO.phoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(updateUserInfoDTO.phoneNumber().trim());
        }

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok().body(
                new UserInfoDTO(
                        updatedUser.getId(),
                        updatedUser.getEmail(),
                        updatedUser.getFirstName(),
                        updatedUser.getLastName(),
                        updatedUser.getPhoneNumber(),
                        updatedUser.getCreatedAt(),
                        updatedUser.getUpdatedAt()
                )
        );
    }

    @PatchMapping("/me/password")
    public ResponseEntity<String> changePassword(
            HttpServletRequest request,
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        User user = getAuthenticatedUser(request);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            changePasswordDTO.currentPassword()
                    )
            );

            user.setPassword(passwordEncoder.encode(changePasswordDTO.newPassword()));
            userRepository.save(user);

            String currentToken = extractJwtToken(request);
            if (currentToken != null) {
                tokenBlacklistService.blacklistToken(currentToken);
            }

            return ResponseEntity.ok().body("Password changed successfully");

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("current password is incorrect");
        }
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        String token = extractJwtToken(request);
        if (token == null || tokenBlacklistService.isTokenBlacklisted(token)) {
            throw new RuntimeException("Unauthorized");
        }

        String email = jwtTokenUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private String extractJwtToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

}
