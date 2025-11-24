package com.dashboardia.backend.controller;

import com.dashboardia.backend.dto.*;
import com.dashboardia.backend.entity.RefreshToken;
import com.dashboardia.backend.entity.Usuario;
import com.dashboardia.backend.security.JwtTokenProvider;
import com.dashboardia.backend.security.UserPrincipal;
import com.dashboardia.backend.service.RefreshTokenService;
import com.dashboardia.backend.external.migo.MigoClient;
import com.dashboardia.backend.external.migo.MigoDniResponse;
import com.dashboardia.backend.repository.UsuarioRepository;
import com.dashboardia.backend.exceptions.TokenRefreshException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final MigoClient migoClient;
    private final UsuarioRepository usuarioRepository;  // Añadir esta línea

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody DniLoginRequest loginRequest) {
        try {
            // 1. Validar DNI con MIGO API
            MigoDniResponse migoResponse = migoClient.consultarDni(loginRequest.getDni());
            
            // 2. Buscar o crear usuario
            Usuario usuario = usuarioRepository.findByDni(loginRequest.getDni())
                .orElseGet(() -> {
                    Usuario newUser = new Usuario();
                    newUser.setDni(loginRequest.getDni());
                    // Configura otros campos del usuario según sea necesario
                    return usuarioRepository.save(newUser);
                });

            // 3. Autenticar
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    usuario.getDni(),
                    usuario.getDni() // Usamos el DNI como contraseña
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 4. Generar tokens
            String jwt = tokenProvider.generateToken(authentication);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(usuario.getId());
            
            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
            
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                refreshToken.getToken(),
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getAuthorities()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en la autenticación: " + e.getMessage());
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        
        return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshTokenService::verifyExpiration)
            .map(RefreshToken::getUsuario)
            .map(usuario -> {
                String token = tokenProvider.generateTokenFromDni(usuario.getDni());
                return ResponseEntity.ok(new TokenRefreshResponse(
                    token,
                    requestRefreshToken,
                    "Token actualizado exitosamente"
                ));
            })
            .orElseThrow(() -> new TokenRefreshException(
                requestRefreshToken, 
                "El token de refresco no es válido"
            ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@Valid @RequestBody LogOutRequest logOutRequest) {
        refreshTokenService.deleteByUserId(logOutRequest.getUserId());
        return ResponseEntity.ok("Cierre de sesión exitoso");
    }
}