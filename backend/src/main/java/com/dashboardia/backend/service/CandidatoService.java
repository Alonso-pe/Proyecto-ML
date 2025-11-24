package com.dashboardia.backend.service;

import com.dashboardia.backend.dto.CandidatoResponse;
import com.dashboardia.backend.entity.CandidatoAlcaldia;
import com.dashboardia.backend.entity.CandidatoPresidencial;
import com.dashboardia.backend.repository.CandidatoAlcaldiaRepository;
import com.dashboardia.backend.repository.CandidatoPresidencialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidatoService {
    private final CandidatoPresidencialRepository presidencialRepository;
    private final CandidatoAlcaldiaRepository alcaldiaRepository;

    public List<CandidatoResponse> obtenerCandidatosPresidenciales() {
        return presidencialRepository.findByActivoTrue().stream()
            .map(this::mapToCandidatoResponse)
            .collect(Collectors.toList());
    }

    public List<CandidatoResponse> obtenerCandidatosAlcaldiaPorDistrito(String distrito) {
        return alcaldiaRepository.findByDistritoAndActivoTrue(distrito).stream()
            .map(this::mapToCandidatoResponse)
            .collect(Collectors.toList());
    }

    public List<CandidatoResponse> obtenerTodosLosCandidatosAlcaldia() {
        return alcaldiaRepository.findByActivoTrue().stream()
            .map(this::mapToCandidatoResponse)
            .collect(Collectors.toList());
    }

    private CandidatoResponse mapToCandidatoResponse(CandidatoPresidencial candidato) {
        CandidatoResponse response = new CandidatoResponse();
        response.setId(candidato.getId());
        response.setNombre(candidato.getNombre());
        response.setPartido(candidato.getPartido());
        response.setLogoUrl(candidato.getLogoUrl());
        response.setDescripcion(candidato.getDescripcion());
        response.setTipo("PRESIDENCIAL");
        return response;
    }

    private CandidatoResponse mapToCandidatoResponse(CandidatoAlcaldia candidato) {
        CandidatoResponse response = new CandidatoResponse();
        response.setId(candidato.getId());
        response.setNombre(candidato.getNombre());
        response.setPartido(candidato.getPartido());
        response.setLogoUrl(candidato.getLogoUrl());
        response.setDescripcion(candidato.getDescripcion());
        response.setTipo("ALCALDIA");
        response.setDistrito(candidato.getDistrito());
        return response;
    }
}