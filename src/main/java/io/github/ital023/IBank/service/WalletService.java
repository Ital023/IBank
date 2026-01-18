package io.github.ital023.IBank.service;

import io.github.ital023.IBank.controller.dto.CreateWalletDto;
import io.github.ital023.IBank.controller.dto.DepositMoneyDto;
import io.github.ital023.IBank.entities.Deposit;
import io.github.ital023.IBank.entities.Wallet;
import io.github.ital023.IBank.exception.DeleteWalletException;
import io.github.ital023.IBank.exception.WalletDataAlreadyExistsException;
import io.github.ital023.IBank.exception.WalletNotFoundException;
import io.github.ital023.IBank.repository.DepositRepository;
import io.github.ital023.IBank.repository.WalletRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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


}
