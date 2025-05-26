package com.bankingapp.backend.controller;

import com.bankingapp.backend.dto.*;
import com.bankingapp.backend.repository.AccountRepository;
import com.bankingapp.backend.repository.TransactionRepository;
import com.bankingapp.backend.repository.UserRepository;
import com.bankingapp.backend.service.FraudDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final FraudDetectionService fraudDetectionService;

    public AdminController(UserRepository userRepository,
                           AccountRepository accountRepository,
                           TransactionRepository transactionRepository,
                           FraudDetectionService fraudDetectionService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.fraudDetectionService = fraudDetectionService;
    }

    @GetMapping("/system-stats")
    public ResponseEntity<SystemStatsDTO> getSystemStatistics() {
        long userCount = userRepository.count();
        long accountCount = accountRepository.count();
        long transactionCount = transactionRepository.count();

        BigDecimal totalAmount = transactionRepository.getTotalTransactionsAmount()
                .orElse(BigDecimal.ZERO);

        return ResponseEntity.ok(
                new SystemStatsDTO(
                        userCount,
                        accountCount,
                        transactionCount,
                        totalAmount
                )
        );
    }

    @GetMapping("/daily-stats")
    public ResponseEntity<List<DailyTransactionStatsDTO>> getDailyStats(
            @RequestParam(defaultValue = "30") int days
    ) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);

        List<DailyTransactionStatsDTO> stats = transactionRepository
                .findDailyTransactionStats(startDate)
                .stream()
                .map(row -> new DailyTransactionStatsDTO(
                        ((Date) row[0]).toLocalDate(),
                        ((Number) row[1]).longValue(),
                        (BigDecimal) row[2]
                ))
                .toList();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/12-month-stats")
    public ResponseEntity<List<MonthlyTransactionStatsDTO>> get12MonthTransactionStats() {
        LocalDateTime startDate = LocalDateTime.now().minusYears(1);
        List<Object[]> rawStats = transactionRepository.findMonthlyStats(startDate);

        List<MonthlyTransactionStatsDTO> stats = rawStats.stream()
                .map(result -> new MonthlyTransactionStatsDTO(
                        (String) result[0],
                        (long) result[1],
                        (BigDecimal) result[2]
                ))
                .toList();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserInfoDTO>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(user -> new UserInfoDTO(
                                user.getId(),
                                user.getEmail(),
                                user.getFirstName(),
                                user.getLastName(),
                                user.getPhoneNumber(),
                                user.getCreatedAt(),
                                user.getUpdatedAt()
                        ))
                        .toList()
        );
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
        return ResponseEntity.ok(
                accountRepository.findAll().stream()
                        .map(account -> new AccountResponseDTO(
                                account.getId(),
                                account.getAccountNumber(),
                                account.getBalance(),
                                account.getCurrency(),
                                account.getOpeningDate(),
                                account.getUser().getId()
                        ))
                        .toList()
        );
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<AdminTransactionResponseDTO>> getAllTransactions() {
        return ResponseEntity.ok(
                transactionRepository.findAll().stream()
                        .map(transaction -> {
                            TransactionRequestDTO requestDTO = new TransactionRequestDTO(
                                    transaction.getAmount().doubleValue(),
                                    transaction.getTimestamp().toString(),
                                    transaction.getType().name(),
                                    transaction.getReceiverAccount().getId(),
                                    transaction.getSenderAccount() != null ?
                                            transaction.getSenderAccount().getId() : -1
                            );

                            FraudDetectionDTO fraud = fraudDetectionService.predictFraud(requestDTO);

                            return new AdminTransactionResponseDTO(
                                    transaction.getSenderAccount() != null ?
                                            transaction.getSenderAccount().getAccountNumber() : "SYS_BANK",
                                    transaction.getReceiverAccount().getAccountNumber(),
                                    transaction.getAmount(),
                                    transaction.getDescription(),
                                    transaction.getType().name(),
                                    transaction.getTimestamp(),
                                    fraud
                            );
                        })
                        .toList()
        );
    }

}
