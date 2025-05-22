package com.bankingapp.backend.dto;

import java.math.BigDecimal;

public record MonthlyTransactionStatsDTO(
        String month,
        long transactionCount,
        BigDecimal totalAmount
) {
}