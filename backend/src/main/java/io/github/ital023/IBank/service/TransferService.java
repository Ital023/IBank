package io.github.ital023.IBank.service;

import io.github.ital023.IBank.controller.dto.TransferMoneyByEmailDto;
import io.github.ital023.IBank.controller.dto.TransferMoneyDto;
import io.github.ital023.IBank.entities.Transfer;
import io.github.ital023.IBank.entities.Wallet;
import io.github.ital023.IBank.exception.TransferException;
import io.github.ital023.IBank.exception.WalletNotFoundException;
import io.github.ital023.IBank.repository.TransferRepository;
import io.github.ital023.IBank.repository.WalletRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TransferService {

    private final TransferRepository transferRepository;
    private final WalletRepository walletRepository;

    public TransferService(TransferRepository transferRepository, WalletRepository walletRepository) {
        this.transferRepository = transferRepository;
        this.walletRepository = walletRepository;
    }

    @Transactional
    public void transferMoney(@Valid TransferMoneyDto dto) {

        var sender = walletRepository.findById(dto.sender())
                .orElseThrow(() -> new WalletNotFoundException("sender does not exist"));

        var receiver = walletRepository.findById(dto.receiver())
                .orElseThrow(() -> new WalletNotFoundException("receiver does not exist"));

        if(sender.getBalance().compareTo(dto.value()) == -1) {
            throw new TransferException("insufficient balance, your current balance is $" + sender.getBalance());
        }

        persistTransfer(dto, sender, receiver);
        updateWallets(dto, sender, receiver);

    }

    @Transactional
    public void transferMoneyByEmail(@Valid TransferMoneyByEmailDto dto) {

        var sender = walletRepository.findByEmail(dto.sender())
                .orElseThrow(() -> new WalletNotFoundException("sender does not exist"));

        var receiver = walletRepository.findByEmail(dto.receiver())
                .orElseThrow(() -> new WalletNotFoundException("receiver does not exist"));

        if(sender.getBalance().compareTo(dto.value()) == -1) {
            throw new TransferException("insufficient balance, your current balance is $" + sender.getBalance());
        }

        persistTransferByEmail(dto, sender, receiver);
        updateWalletsByEmail(dto, sender, receiver);

    }

    private void updateWallets(TransferMoneyDto dto, Wallet sender, Wallet receiver) {
        sender.setBalance(sender.getBalance().subtract(dto.value()));
        receiver.setBalance(receiver.getBalance().add(dto.value()));

        walletRepository.save(sender);
        walletRepository.save(receiver);
    }

    private void persistTransfer(TransferMoneyDto dto, Wallet sender, Wallet receiver) {
        var transfer = new Transfer();
        transfer.setSender(sender);
        transfer.setReceiver(receiver);
        transfer.setTransferDateTime(LocalDateTime.now());
        transfer.setTransferValue(dto.value());

        transferRepository.save(transfer);
    }

    private void updateWalletsByEmail(TransferMoneyByEmailDto dto, Wallet sender, Wallet receiver) {
        sender.setBalance(sender.getBalance().subtract(dto.value()));
        receiver.setBalance(receiver.getBalance().add(dto.value()));

        walletRepository.save(sender);
        walletRepository.save(receiver);
    }

    private void persistTransferByEmail(TransferMoneyByEmailDto dto, Wallet sender, Wallet receiver) {
        var transfer = new Transfer();
        transfer.setSender(sender);
        transfer.setReceiver(receiver);
        transfer.setTransferDateTime(LocalDateTime.now());
        transfer.setTransferValue(dto.value());

        transferRepository.save(transfer);
    }
}
