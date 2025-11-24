package com.dashboardia.backend.repository;

import com.dashboardia.backend.entity.RefreshToken;
import com.dashboardia.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUsuario(Usuario usuario);
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.usuario.id = :userId")
    void deleteByUsuarioId(@Param("userId") Long userId);

}