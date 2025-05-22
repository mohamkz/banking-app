package com.bankingapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyTransactionStatsDTO(
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,
        long transactionCount,
        BigDecimal totalAmount
) {
}
