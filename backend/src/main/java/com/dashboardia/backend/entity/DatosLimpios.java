package com.dashboardia.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;


@Entity
@Table(name = "datos_limpios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatosLimpios {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String dni;
private String candidato;
private String region;
private java.time.LocalDate fecha;
private String voto;


private Instant creadoEn = Instant.now();
}