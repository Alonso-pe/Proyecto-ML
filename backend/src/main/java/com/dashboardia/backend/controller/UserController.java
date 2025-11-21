package com.dashboardia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.dashboardia.backend.external.migo.MigoException;
import com.dashboardia.backend.external.migo.MigoDniResponse;
import com.dashboardia.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> buscarDni(@PathVariable String dni) {
        try {
            MigoDniResponse respuesta = userService.verificarDatosPorDni(dni);
            return ResponseEntity.ok(respuesta);
        } catch (MigoException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
