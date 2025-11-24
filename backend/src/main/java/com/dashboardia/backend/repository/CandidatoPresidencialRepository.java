package com.dashboardia.backend.repository;

import com.dashboardia.backend.entity.CandidatoPresidencial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidatoPresidencialRepository extends JpaRepository<CandidatoPresidencial, Long> {
    List<CandidatoPresidencial> findByActivoTrue();
}