package com.dashboardia.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "candidato_alcaldia")
@Data
public class CandidatoAlcaldia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String partido;

    @Column(nullable = false)
    private String distrito;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private boolean activo = true;
}