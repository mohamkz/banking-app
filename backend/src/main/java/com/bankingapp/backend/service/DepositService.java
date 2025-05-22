package com.bankingapp.backend.service;

import com.bankingapp.backend.exception.AccountNotFoundException;
import com.bankingapp.backend.model.Account;
import com.bankingapp.backend.model.Transaction;
import com.bankingapp.backend.repository.AccountRepository;
import com.bankingapp.backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DepositService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public DepositService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Transaction depositToAccount(
            String accountNumber,
            BigDecimal amount,
            String description
    ) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setSenderAccount(null);
        transaction.setReceiverAccount(account);

        return transactionRepository.save(transaction);
    }

}
