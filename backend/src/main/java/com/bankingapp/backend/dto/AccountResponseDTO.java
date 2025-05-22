package com.bankingapp.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponseDTO(
        Long id,
        String accountNumber,
        BigDecimal balance,
        String currency,
        LocalDateTime openingDate,
        Long userId
) {
}
