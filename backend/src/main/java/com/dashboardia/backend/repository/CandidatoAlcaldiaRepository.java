package com.dashboardia.backend.repository;

import com.dashboardia.backend.entity.CandidatoAlcaldia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidatoAlcaldiaRepository extends JpaRepository<CandidatoAlcaldia, Long> {
    List<CandidatoAlcaldia> findByDistritoAndActivoTrue(String distrito);
    List<CandidatoAlcaldia> findByActivoTrue();
}