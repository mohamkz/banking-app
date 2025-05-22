package com.bankingapp.backend.dto;

import java.time.LocalDateTime;

public record UserInfoDTO(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
