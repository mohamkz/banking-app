package com.bankingapp.backend.controller;

import com.bankingapp.backend.dto.AccountResponseDTO;
import com.bankingapp.backend.dto.DepositRequestDTO;
import com.bankingapp.backend.dto.TransactionResponseDTO;
import com.bankingapp.backend.model.Account;
import com.bankingapp.backend.model.Transaction;
import com.bankingapp.backend.model.User;
import com.bankingapp.backend.repository.UserRepository;
import com.bankingapp.backend.service.AccountService;
import com.bankingapp.backend.service.DepositService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;
    private final DepositService depositService;

    public AccountController(
            AccountService accountService,
            UserRepository userRepository,
            DepositService depositService
    ) {
        this.accountService = accountService;
        this.userRepository = userRepository;
        this.depositService = depositService;
    }

    @PostMapping("/new")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<AccountResponseDTO> openAccount(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Account account = accountService.createAccount(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AccountResponseDTO(
                        account.getId(),
                        account.getAccountNumber(),
                        account.getBalance(),
                        account.getCurrency(),
                        account.getOpeningDate(),
                        account.getUser().getId()
                ));
    }

    @GetMapping("/owned")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AccountResponseDTO>> listAccounts(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            List<Account> accounts = accountService.findAccountsByUserId(user.getId());

            List<AccountResponseDTO> response = accounts.stream()
                    .map(account -> new AccountResponseDTO(
                            account.getId(),
                            account.getAccountNumber(),
                            account.getBalance(),
                            account.getCurrency(),
                            account.getOpeningDate(),
                            account.getUser().getId()
                    ))
                    .toList();

            return ResponseEntity.ok(response);
        }
        catch(RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponseDTO> viewAccount(
            @PathVariable String accountNumber,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Account account = accountService.validateAccountAccess(accountNumber, userDetails);

        return ResponseEntity.ok(new AccountResponseDTO(
                account.getId(),
                account.getAccountNumber(),
                account.getBalance(),
                account.getCurrency(),
                account.getOpeningDate(),
                account.getUser().getId()
        ));
    }

    @PostMapping("/{accountNumber}/deposit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionResponseDTO> deposit(
            @PathVariable String accountNumber,
            @Valid @RequestBody DepositRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        accountService.validateAccountAccess(accountNumber, userDetails);

        Transaction transaction = depositService.depositToAccount(
                accountNumber,
                request.amount(),
                request.description()
        );

        return ResponseEntity.status(HttpStatus.OK)
                .body(new TransactionResponseDTO(
                        null,
                        transaction.getReceiverAccount().getAccountNumber(),
                        transaction.getAmount(),
                        transaction.getDescription(),
                        transaction.getType().name(),
                        transaction.getTimestamp()
                ));
    }

}
