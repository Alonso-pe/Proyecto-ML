// src/main/java/com/dashboardia/backend/dto/DniLoginRequest.java
package com.dashboardia.backend.dto;

import com.dashboardia.backend.validation.ValidDni;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DniLoginRequest {
    @NotBlank
    @ValidDni
    @Size(min = 8, max = 8, message = "El DNI debe tener 8 dígitos")
    private String dni;

    // Getters y setters
    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }
}