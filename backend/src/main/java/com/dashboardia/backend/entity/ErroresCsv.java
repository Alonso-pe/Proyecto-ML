package com.dashboardia.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "errores_csv")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErroresCsv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String archivo;

    @Column(columnDefinition = "TEXT")
    private String detalleError;

    private Instant fechaError = Instant.now();
}
