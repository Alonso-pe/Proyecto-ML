package com.dashboardia.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "candidato_presidencial")
@Data
public class CandidatoPresidencial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String partido;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private boolean activo = true;
}