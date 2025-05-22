package com.bankingapp.backend.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record DepositRequestDTO(
        @Positive(message = "Amount must be positive")
        BigDecimal amount,

        String description
) {
}
