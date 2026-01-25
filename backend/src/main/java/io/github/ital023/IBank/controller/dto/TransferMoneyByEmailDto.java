package io.github.ital023.IBank.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TransferMoneyByEmailDto(@Email String sender, @NotNull @DecimalMin("0.01") BigDecimal value, @Email String receiver) {
}
