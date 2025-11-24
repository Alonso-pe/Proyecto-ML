package com.dashboardia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VotoRequest {
    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    @NotNull(message = "El ID del candidato presidencial es obligatorio")
    private Long candidatoPresidencialId;

    @NotNull(message = "El ID del primer candidato a alcaldía es obligatorio")
    private Long candidatoAlcaldia1Id;

    @NotNull(message = "El ID del segundo candidato a alcaldía es obligatorio")
    private Long candidatoAlcaldia2Id;
}