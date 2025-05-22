package com.bankingapp.backend.exception;

public class EmailAlreadyUsedException extends IllegalArgumentException {

    public EmailAlreadyUsedException(String message) {
        super(message);
    }

}
