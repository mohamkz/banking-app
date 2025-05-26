package com.bankingapp.backend.dto;

public record FraudDetectionDTO(
        boolean is_fraud,
        double risk_score
) {
}
