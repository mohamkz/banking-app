package com.bankingapp.backend.dto;

import java.math.BigDecimal;

public record SystemStatsDTO(
        long totalUsers,
        long totalAccounts,
        long totalTransactions,
        BigDecimal totalTransactionsAmount
) {
}
