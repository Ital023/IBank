package io.github.ital023.IBank.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_deposit")
public class Deposit {

    @Id
    @Column(name = "deposit_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID depositId;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @Column(name = "deposit_value")
    private BigDecimal depositValue;

    @Column(name = "deposit_date_time")
    private LocalDateTime depositDateTime;

    @Column(name = "ip_address")
    private String ipAddress;


}
