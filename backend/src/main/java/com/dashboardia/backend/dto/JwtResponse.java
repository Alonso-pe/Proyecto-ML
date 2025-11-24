// src/main/java/com/dashboardia/backend/dto/JwtResponse.java
package com.dashboardia.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

@Getter
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String refreshToken;
    private Long id;
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    // Constructor para compatibilidad con el código existente
    public JwtResponse(String accessToken, Long id, String dni, String nombre) {
        this.token = accessToken;
        this.refreshToken = null; // O establece un valor por defecto
        this.id = id;
        this.username = dni;
        this.authorities = null; // O establece una colección vacía
    }

    // Getters (generados por @Getter de Lombok)
    // No es necesario escribirlos manualmente
}