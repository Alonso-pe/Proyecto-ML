package com.dashboardia.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.dashboardia.backend.dto.DniRequest;
import com.dashboardia.backend.dto.JwtResponse;
import com.dashboardia.backend.migo.MigoException;
import com.dashboardia.backend.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login-dni")
    public JwtResponse loginWithDni(@RequestBody DniRequest request) throws MigoException {
        return authService.loginWithDni(request.getDni());
    }
}


