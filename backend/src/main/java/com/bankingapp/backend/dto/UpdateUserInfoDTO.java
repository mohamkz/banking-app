package com.bankingapp.backend.dto;

public record UpdateUserInfoDTO (
        String firstName,
        String lastName,
        String phoneNumber
) {
}