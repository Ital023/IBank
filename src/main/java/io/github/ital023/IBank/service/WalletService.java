package io.github.ital023.IBank.service;

import io.github.ital023.IBank.controller.dto.CreateWalletDto;
import io.github.ital023.IBank.entities.Wallet;
import io.github.ital023.IBank.exception.DeleteWalletException;
import io.github.ital023.IBank.exception.WalletDataAlreadyExistsException;
import io.github.ital023.IBank.repository.WalletRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class WalletService {
    
    private final WalletRepository walletRepository;

    public WalletService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
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

}
