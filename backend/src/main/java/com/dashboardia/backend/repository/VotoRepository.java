package com.dashboardia.backend.repository;

import com.dashboardia.backend.entity.Voto;
import com.dashboardia.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VotoRepository extends JpaRepository<Voto, Long> {
    boolean existsByUsuario(Usuario usuario);
    Optional<Voto> findByUsuario(Usuario usuario);
}
