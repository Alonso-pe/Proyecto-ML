package com.dashboardia.backend.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dashboardia.backend.entity.RefreshToken;  // Asegúrate de importar la entidad correcta
import com.dashboardia.backend.exceptions.TokenRefreshException;
import com.dashboardia.backend.repository.RefreshTokenRepository;
import com.dashboardia.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    
    @Value("${app.jwt.refresh-expiration-ms}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    @Transactional
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUsuarioId(userId);
    }
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
    
    public RefreshToken createRefreshToken(Long usuarioId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsuario(usuarioRepository.findById(usuarioId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }
    
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "El token de refresco ha expirado");
        }
        return token;
    }
    
    
}