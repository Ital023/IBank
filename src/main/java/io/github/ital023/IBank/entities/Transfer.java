package io.github.ital023.IBank.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_transfer")
public class Transfer {

    @Id
    @Column(name = "transfer_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID transferId;

    @ManyToOne
    @JoinColumn(name = "wallet_receiver_id")
    private Wallet receiver;

    @ManyToOne
    @JoinColumn(name = "wallet_sender_id")
    private Wallet sender;

    @Column(name = "transfer_value")
    private BigDecimal transferValue;

    @Column(name = "transfer_date_time")
    private LocalDateTime transferDateTime;

}
