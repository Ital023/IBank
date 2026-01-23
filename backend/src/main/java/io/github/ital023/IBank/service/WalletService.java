package io.github.ital023.IBank.service;

import io.github.ital023.IBank.controller.dto.*;
import io.github.ital023.IBank.entities.Deposit;
import io.github.ital023.IBank.entities.Wallet;
import io.github.ital023.IBank.exception.DeleteWalletException;
import io.github.ital023.IBank.exception.StatementException;
import io.github.ital023.IBank.exception.WalletDataAlreadyExistsException;
import io.github.ital023.IBank.exception.WalletNotFoundException;
import io.github.ital023.IBank.repository.DepositRepository;
import io.github.ital023.IBank.repository.WalletRepository;
import io.github.ital023.IBank.repository.dto.StatementView;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class WalletService {
    
    private final WalletRepository walletRepository;
    private final DepositRepository depositRepository;

    public WalletService(WalletRepository walletRepository, DepositRepository depositRepository) {
        this.walletRepository = walletRepository;
        this.depositRepository = depositRepository;
    }


    public Wallet createWallet(CreateWalletDto dto) {
        var walletDb = walletRepository.findByCpfOrEmail(dto.cpf(), dto.email());

        if(walletDb.isPresent()) {
            throw new WalletDataAlreadyExistsException("cpf or email already exists");
        }

        Wallet wallet = new Wallet();

        wallet.setBalance(BigDecimal.ZERO);
        wallet.setCpf(dto.cpf());
        wallet.setName(dto.name());
        wallet.setEmail(dto.email());

        return walletRepository.save(wallet);
    }

    public boolean deleteWallet(UUID walletId) {
        var wallet = walletRepository.findById(walletId);

        if(wallet.isPresent()) {

            if(wallet.get().getBalance().compareTo(BigDecimal.ZERO) != 0) {
                throw new DeleteWalletException("the balance isn't zero, the current amount is $" + wallet.get().getBalance());
            }

            walletRepository.deleteById(walletId);
        }

        return wallet.isPresent();
    }

    @Transactional
    public void depositMoney(UUID walletdId, DepositMoneyDto dto, String ipAddress) {

        var wallet = walletRepository.findById(walletdId)
                .orElseThrow(() -> new WalletNotFoundException("There's no wallet with this id"));

        var deposit = new Deposit();
        deposit.setWallet(wallet);
        deposit.setDepositValue(dto.depositValue());
        deposit.setDepositDateTime(LocalDateTime.now());
        deposit.setIpAddress(ipAddress);

        depositRepository.save(deposit);

        wallet.setBalance(wallet.getBalance().add(dto.depositValue()));
        walletRepository.save(wallet);

    }


    public StatementDto getStatements(UUID walletId, Integer page, Integer pageSize) {

        var wallet = walletRepository.findById(walletId)
                .orElseThrow(()-> new WalletNotFoundException("There's no wallet with this id"));

        var pageRequest = PageRequest.of(page, pageSize, Sort.Direction.DESC, "statement_date_time");

        var statements = walletRepository.findStatements(walletId.toString(), pageRequest)
                .map(view -> mapToDto(walletId, view));

        return new StatementDto(
         new WalletDto(wallet.getWalletId(), wallet.getCpf(), wallet.getName(), wallet.getEmail(), wallet.getBalance()),
                statements.getContent(),
                new PaginationDto(statements.getNumber(), statements.getSize(), statements.getTotalElements(), statements.getTotalPages())
        );
    }

    private StatementItemDto mapToDto(UUID walletId, StatementView view) {
        if(view.getType().equalsIgnoreCase("deposit")) {
            return mapToDeposit(view);
        }

        if(view.getType().equalsIgnoreCase("transfer")
        && view.getWalletSender().equalsIgnoreCase(walletId.toString())) {
            return mapWhenTransferSender(walletId, view);
        }

        if(view.getType().equalsIgnoreCase("transfer")
                && view.getWalletReceiver().equalsIgnoreCase(walletId.toString())) {
            return mapWhenTransferReceived(walletId, view);
        }

        throw new StatementException("Invalid type: " + view.getType());
    }

    private StatementItemDto mapWhenTransferReceived(UUID walletId, StatementView view) {
        return new StatementItemDto(
                view.getStatementId(),
                view.getType(),
                "money received from" + view.getWalletSender(),
                view.getStatementValue(),
                view.getStatementDateTime(),
                StatementOperation.CREDIT
        );
    }

    private StatementItemDto mapWhenTransferSender(UUID walletId, StatementView view) {
        return new StatementItemDto(
                view.getStatementId(),
                view.getType(),
                "money sent to" + view.getWalletReceiver(),
                view.getStatementValue(),
                view.getStatementDateTime(),
                StatementOperation.DEBIT
        );
    }

    private StatementItemDto mapToDeposit(StatementView view) {
        return new StatementItemDto(
                view.getStatementId(),
                view.getType(),
                "money deposit",
                view.getStatementValue(),
                view.getStatementDateTime(),
                StatementOperation.CREDIT
        );
    }

    public WalletDto findById(String email) {
        Wallet wallet = walletRepository.findByEmail(email)
                .orElseThrow(()-> new WalletNotFoundException("There's no wallet with this id"));

        return new WalletDto(
                wallet.getWalletId(),
                wallet.getCpf(),
                wallet.getName(),
                wallet.getEmail(),
                wallet.getBalance()
        );
    }

}
