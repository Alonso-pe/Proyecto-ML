package com.dashboardia.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "voto")
@Data
public class Voto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "candidato_presidencial_id", nullable = false)
    private CandidatoPresidencial candidatoPresidencial;

    @ManyToOne
    @JoinColumn(name = "candidato_alcaldia_1_id", nullable = false)
    private CandidatoAlcaldia candidatoAlcaldia1;

    @ManyToOne
    @JoinColumn(name = "candidato_alcaldia_2_id", nullable = false)
    private CandidatoAlcaldia candidatoAlcaldia2;

    @Column(name = "fecha_voto", nullable = false)
    private LocalDateTime fechaVoto = LocalDateTime.now();

    @Column(name = "ip_voto")
    private String ipVoto;
}