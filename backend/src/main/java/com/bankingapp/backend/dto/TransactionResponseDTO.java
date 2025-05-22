package com.bankingapp.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponseDTO(
        String senderAccountNumber,
        String receiverAccountNumber,
        BigDecimal amount,
        String description,
        String type,
        LocalDateTime timestamp
) {

}
