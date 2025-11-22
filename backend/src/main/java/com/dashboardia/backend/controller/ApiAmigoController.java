package com.dashboardia.backend.controller;

import com.dashboardia.backend.dto.DniResponse;
import com.dashboardia.backend.service.ApiAmigoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dni")
@CrossOrigin(origins = "*") // Permite acceso desde el frontend
public class ApiAmigoController {

    private final ApiAmigoService apiAmigoService;

    public ApiAmigoController(ApiAmigoService apiAmigoService) {
        this.apiAmigoService = apiAmigoService;
    }

    @GetMapping("/{dni}")
    public ResponseEntity<?> obtenerDatosPorDni(@PathVariable String dni) {
        DniResponse response = apiAmigoService.buscarPorDni(dni);

        if (response == null) {
            return ResponseEntity.status(404).body("DNI no encontrado");
        }

        return ResponseEntity.ok(response);
    }
}
