package io.github.ital023.IBank.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CPF;

public record CreateWalletDto(@CPF String cpf,
                              @Email @NotBlank String email,
                              @NotBlank String name) {
}
