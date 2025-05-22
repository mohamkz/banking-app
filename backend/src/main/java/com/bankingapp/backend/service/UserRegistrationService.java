package com.bankingapp.backend.service;

import com.bankingapp.backend.exception.EmailAlreadyUsedException;
import com.bankingapp.backend.exception.PhoneAlreadyUsedException;
import com.bankingapp.backend.model.User;
import com.bankingapp.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserRegistrationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserRegistrationService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public void registerUser(String email, String password,
                             String first_name, String last_name,
                             String phoneNumber) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException("Email address already in use");
        }
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new PhoneAlreadyUsedException("Phone number already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(first_name);
        user.setLastName(last_name);
        user.setPhoneNumber(phoneNumber);

        userRepository.save(user);
    }



}
