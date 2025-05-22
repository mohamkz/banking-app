package com.bankingapp.backend.exception;

public class PhoneAlreadyUsedException extends IllegalArgumentException {

    public PhoneAlreadyUsedException(String message) {
        super(message);
    }

}
