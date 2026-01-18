package io.github.ital023.IBank.repository;

import io.github.ital023.IBank.entities.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransferRepository extends JpaRepository<Transfer, UUID> {
}
