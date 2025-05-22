package com.bankingapp.backend.controller;

import com.bankingapp.backend.dto.TransactionResponseDTO;
import com.bankingapp.backend.dto.TransferRequestDTO;
import com.bankingapp.backend.model.Transaction;
import com.bankingapp.backend.service.AccountService;
import com.bankingapp.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final AccountService accountService;
    private final TransactionService transactionService;

    public TransferController(AccountService accountService, TransactionService transactionService) {
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionResponseDTO> transfer(
            @Valid @RequestBody TransferRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        accountService.validateAccountAccess(request.senderAccountNumber(), userDetails);

        Transaction transaction = transactionService.processTransfer(
                request.senderAccountNumber(),
                request.receiverAccountNumber(),
                request.amount(),
                request.description()
        );
        return ResponseEntity.ok(new TransactionResponseDTO(
                transaction.getSenderAccount().getAccountNumber(),
                transaction.getReceiverAccount().getAccountNumber(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getType().name(),
                transaction.getTimestamp()
        ));
    }

    @GetMapping("/account/{accountNumber}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionsByAccount(
            @PathVariable String accountNumber,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getAllUserTransactions(accountNumber, userDetails.getUsername())
        );
    }

    @GetMapping("/deposits/account/{accountNumber}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TransactionResponseDTO>> getDepositTransactionsByAccount(
            @PathVariable String accountNumber,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getUserDepositTransactions(accountNumber, userDetails.getUsername())
        );
    }

    @GetMapping("/sent/account/{accountNumber}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TransactionResponseDTO>> getSentTransactionsByAccount(
            @PathVariable String accountNumber,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getUserSentTransactions(accountNumber, userDetails.getUsername())
        );
    }

    @GetMapping("/received/account/{accountNumber}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TransactionResponseDTO>> getReceivedTransactionsByAccount(
            @PathVariable String accountNumber,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getUserReceivedTransactions(accountNumber, userDetails.getUsername())
        );
    }

}