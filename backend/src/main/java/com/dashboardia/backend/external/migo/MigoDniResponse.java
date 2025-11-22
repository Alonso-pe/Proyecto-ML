package com.dashboardia.backend.external.migo;

import lombok.Data;

@Data
public class MigoDniResponse {
    private String dni;
    private String nombre;
    private String apellido;
    private String direccion;
}
