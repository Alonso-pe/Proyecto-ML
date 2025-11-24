package com.dashboardia.backend.dto;

import lombok.Data;

@Data
public class CandidatoResponse {
    private Long id;
    private String nombre;
    private String partido;
    private String logoUrl;
    private String descripcion;
    private String tipo; // "PRESIDENCIAL" o "ALCALDIA"
    private String distrito; // Solo para alcaldía
}