package com.bankingapp.backend.service;

import com.bankingapp.backend.dto.FraudDetectionDTO;
import com.bankingapp.backend.dto.TransactionRequestDTO;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

@Service
public class FraudDetectionService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${fraud.detection.api.url}")
    private String fraudApiUrl;

    public FraudDetectionDTO predictFraud(TransactionRequestDTO dto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TransactionRequestDTO> request = new HttpEntity<>(dto, headers);

        try {
            ResponseEntity<FraudDetectionDTO> response = restTemplate.postForEntity(
                    fraudApiUrl,
                    request,
                    FraudDetectionDTO.class
            );
            return response.getBody();
        } catch (Exception e) {
            return new FraudDetectionDTO(
                    false,
                    0.0
            );
        }
    }

}