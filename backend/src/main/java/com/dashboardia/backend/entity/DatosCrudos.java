package com.dashboardia.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;


@Entity
@Table(name = "datos_crudos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatosCrudos {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String dni;
private String candidato;
private String region;
private java.time.LocalDate fecha;
private String voto;


@Column(columnDefinition = "text")
private String filaOriginal;


private Instant cargadoEn = Instant.now();
}