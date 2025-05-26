package com.bankingapp.backend.service;

import com.bankingapp.backend.exception.AccountNotFoundException;
import com.bankingapp.backend.exception.InsufficientFundsException;
import com.bankingapp.backend.model.Account;
import com.bankingapp.backend.model.User;
import com.bankingapp.backend.repository.AccountRepository;
import com.bankingapp.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Account createAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Account account = new Account();
        account.setUser(user);

        return accountRepository.save(account);
    }

    public Account validateAccountAccess(String accountNumber, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Account account = findAccountByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccountNotFoundException("Unauthorized access");
        }

        return account;
    }

    public List<Account> findAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public Optional<Account> findAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

}
