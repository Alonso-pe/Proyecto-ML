package com.dashboardia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.dashboardia.backend.external.migo.MigoException;
import com.dashboardia.backend.external.migo.MigoDniResponse;
import com.dashboardia.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private Environment env;

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> buscarDni(@PathVariable String dni) {
        try {
            MigoDniResponse respuesta = userService.verificarDatosPorDni(dni);
            return ResponseEntity.ok(respuesta);
        } catch (MigoException e) {
            // If running in dev profile, return a helpful mock response instead of 500
            String[] active = env.getActiveProfiles();
            for (String p : active) {
                if ("dev".equals(p)) {
                    MigoDniResponse mock = buildDevMock(dni);
                    return ResponseEntity.ok(mock);
                }
            }
            Map<String, String> body = new HashMap<>();
            body.put("error", "External service error");
            body.put("details", e.getMessage());
            return ResponseEntity.status(502).body(body);
        }
    }

    private MigoDniResponse buildDevMock(String dni) {
        MigoDniResponse m = new MigoDniResponse();
        m.setDni(dni);
        // Provide predictable mock names for common test DNIs
        switch (dni) {
            case "12345678":
                m.setNombre("Juan Alberto");
                m.setApellido("Pérez García");
                break;
            case "87654321":
                m.setNombre("María Fernanda");
                m.setApellido("Castillo Rojas");
                break;
            default:
                m.setNombre("Nombre Prueba");
                m.setApellido("Apellido Prueba");
        }
        m.setDireccion("Desconocida");
        return m;
    }
}
