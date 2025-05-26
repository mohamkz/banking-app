package com.bankingapp.backend.dto;

public record TransactionRequestDTO(
        double amount,
        String timestamp,
        String type,
        Long receiver_account,
        Long sender_account
) {
}
