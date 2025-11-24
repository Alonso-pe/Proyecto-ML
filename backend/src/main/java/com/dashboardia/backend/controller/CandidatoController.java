package com.dashboardia.backend.controller;

import com.dashboardia.backend.dto.CandidatoResponse;
import com.dashboardia.backend.service.CandidatoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/candidatos")
public class CandidatoController {
    private final CandidatoService candidatoService;

    public CandidatoController(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    @GetMapping("/presidenciales")
    public ResponseEntity<List<CandidatoResponse>> obtenerCandidatosPresidenciales() {
        return ResponseEntity.ok(candidatoService.obtenerCandidatosPresidenciales());
    }

    @GetMapping("/alcaldias")
    public ResponseEntity<List<CandidatoResponse>> obtenerCandidatosAlcaldia(@RequestParam(required = false) String distrito) {
        if (distrito != null && !distrito.isEmpty()) {
            return ResponseEntity.ok(candidatoService.obtenerCandidatosAlcaldiaPorDistrito(distrito));
        }
        return ResponseEntity.ok(candidatoService.obtenerTodosLosCandidatosAlcaldia());
    }
}