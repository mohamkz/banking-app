package com.bankingapp.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequestDTO(
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @NotBlank @Email String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @NotBlank String password,

    @NotBlank(message = "First name is required")
    @NotBlank String firstName,

    @NotBlank(message = "Last  name is required")
    @NotBlank String lastName,

    @NotBlank(message = "Phone number is required")
    @NotBlank String phoneNumber
) {
}
