package com.bankingapp.backend.service;

import com.bankingapp.backend.dto.TransactionResponseDTO;
import com.bankingapp.backend.exception.AccountNotFoundException;
import com.bankingapp.backend.exception.InsufficientFundsException;
import com.bankingapp.backend.model.Account;
import com.bankingapp.backend.model.Transaction;
import com.bankingapp.backend.repository.AccountRepository;
import com.bankingapp.backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Transaction processTransfer(
            String senderAccountNumber,
            String receiverAccountNumber,
            BigDecimal amount,
            String description
    ) {
        Account sender = accountRepository.findByAccountNumber(senderAccountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Account receiver = accountRepository.findByAccountNumber(receiverAccountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Not enough balance");
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setType(Transaction.TransactionType.TRANSFER);
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);

        transactionRepository.save(transaction);

        accountRepository.save(sender);
        accountRepository.save(receiver);

        return transaction;
    }

    public List<TransactionResponseDTO> getAllUserTransactions(String accountNumber, String email) {
        return transactionRepository
                .findByAccountNumberAndEmail(accountNumber, email)
                .stream()
                .map((Transaction t) -> new TransactionResponseDTO(
                        t.getSenderAccount().getAccountNumber(),
                        t.getReceiverAccount().getAccountNumber(),
                        t.getAmount(),
                        t.getDescription(),
                        t.getType().name(),
                        t.getTimestamp()
                ))
                .toList();
    }

    public List<TransactionResponseDTO> getUserDepositTransactions(String accountNumber, String email) {
        return transactionRepository.findDepositsByAccountAndEmail(accountNumber, email)
                .stream()
                .map((Transaction t) -> new TransactionResponseDTO(
                        "SYS_BANK",
                        t.getReceiverAccount().getAccountNumber(),
                        t.getAmount(),
                        t.getDescription(),
                        t.getType().name(),
                        t.getTimestamp()
                ))
                .toList();
    }

    public List<TransactionResponseDTO> getUserSentTransactions(String accountNumber, String email) {
        return transactionRepository
                .findSentTransfersByAccountAndEmail(accountNumber, email)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<TransactionResponseDTO> getUserReceivedTransactions(String accountNumber, String email) {
        return transactionRepository
                .findReceivedTransactionsByAccountAndEmail(accountNumber, email)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private TransactionResponseDTO convertToDTO(Transaction t) {
        return new TransactionResponseDTO(
                t.getSenderAccount().getAccountNumber(),
                t.getReceiverAccount().getAccountNumber(),
                t.getAmount(),
                t.getDescription(),
                t.getType().name(),
                t.getTimestamp()
        );
    }

}
