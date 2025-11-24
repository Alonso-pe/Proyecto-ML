package com.dashboardia.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UsuarioResponse {
    private Long id;
    private String dni;
    private String nombre;
    private String apellido;
    private String distrito;
    private String departamento;
    private boolean haVotado;
    private LocalDateTime fechaCreacion;
}