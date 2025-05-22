package com.bankingapp.backend.repository;

import com.bankingapp.backend.model.Transaction;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("SELECT t FROM Transaction t " +
            "JOIN t.senderAccount sa " +
            "JOIN sa.user u " +
            "WHERE (sa.accountNumber = :accountNumber OR :accountNumber IS NULL) AND " +
            "u.email = :email AND t.type = 'TRANSFER'")
    List<Transaction> findSentTransfersByAccountAndEmail(
            @Param("accountNumber") String accountNumber,
            @Param("email") String email);

    @Query("SELECT t FROM Transaction t " +
            "JOIN t.receiverAccount ra " +
            "JOIN ra.user u " +
            "WHERE (ra.accountNumber = :accountNumber OR :accountNumber IS NULL) AND " +
            "u.email = :email AND t.type = 'TRANSFER'")
    List<Transaction> findReceivedTransactionsByAccountAndEmail(
            @Param("accountNumber") String accountNumber,
            @Param("email") String email);

    @Query("SELECT t FROM Transaction t " +
            "JOIN t.senderAccount sa " +
            "JOIN sa.user su " +
            "JOIN t.receiverAccount ra " +
            "JOIN ra.user ru " +
            "WHERE (t.senderAccount.accountNumber = :accountNumber OR " +
            "t.receiverAccount.accountNumber = :accountNumber) AND " +
            "(su.email = :email OR ru.email = :email) " +
            "ORDER BY t.timestamp DESC")
    List<Transaction> findByAccountNumberAndEmail(
            @Param("accountNumber") String accountNumber,
            @Param("email") String email);

    @Query("SELECT t FROM Transaction t " +
            "JOIN t.receiverAccount ra " +
            "JOIN ra.user u " +
            "WHERE (ra.accountNumber = :accountNumber OR :accountNumber IS NULL) AND " +
            "u.email = :email AND t.type = 'DEPOSIT'")
    List<Transaction> findDepositsByAccountAndEmail(
            @Param("accountNumber") String accountNumber,
            @Param("email") String email);

    @Query("SELECT SUM(t.amount) FROM Transaction t")
    Optional<BigDecimal> getTotalTransactionsAmount();

    @Query("SELECT FUNCTION('TO_CHAR', t.timestamp, 'YYYY-MM') AS month, " +
            "COUNT(t) AS count, " +
            "SUM(t.amount) AS amount " +
            "FROM Transaction t " +
            "WHERE t.timestamp >= :startDate " +
            "GROUP BY FUNCTION('TO_CHAR', t.timestamp, 'YYYY-MM') " +
            "ORDER BY month DESC")
    List<Object[]> findMonthlyStats(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT 
            CAST(t.timestamp AS date) as day,
            COUNT(t) as count,
            SUM(t.amount) as amount
        FROM Transaction t
        WHERE t.timestamp >= :startDate
        GROUP BY CAST(t.timestamp AS date)
        ORDER BY day DESC
        """)
    List<Object[]> findDailyTransactionStats(@Param("startDate") LocalDateTime startDate);

}
