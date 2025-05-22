package com.bankingapp.backend.dto;

import org.springframework.http.HttpStatus;

import java.util.Map;

public record ErrorResponseDTO(
        String message,
        Map<String, String> errors,
        HttpStatus status
) {
}
