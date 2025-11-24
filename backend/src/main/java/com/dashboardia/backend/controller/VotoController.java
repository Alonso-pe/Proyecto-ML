package com.dashboardia.backend.controller;

import com.dashboardia.backend.dto.VotoRequest;
import com.dashboardia.backend.service.VotoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/votos")
public class VotoController {
    private final VotoService votoService;

    public VotoController(VotoService votoService) {
        this.votoService = votoService;
    }

    @PostMapping
    public ResponseEntity<?> registrarVoto(@Valid @RequestBody VotoRequest votoRequest, HttpServletRequest request) {
        votoService.registrarVoto(votoRequest, request);
        return ResponseEntity.ok().build();
    }
}