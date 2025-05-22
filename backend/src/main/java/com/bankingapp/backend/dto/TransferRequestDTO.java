package com.bankingapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record TransferRequestDTO(
        @NotBlank String senderAccountNumber,
        @NotBlank String receiverAccountNumber,
        @Positive BigDecimal amount,
        String description
) {
}
