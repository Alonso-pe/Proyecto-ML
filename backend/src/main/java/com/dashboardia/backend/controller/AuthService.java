package com.dashboardia.backend.service;

import org.springframework.stereotype.Service;

import com.dashboardia.backend.dto.JwtResponse;
import com.dashboardia.backend.entity.User;
import com.dashboardia.backend.migo.MigoClient;
import com.dashboardia.backend.migo.MigoDniResponse;
import com.dashboardia.backend.migo.MigoException;
import com.dashboardia.backend.repository.UserRepository;
import com.dashboardia.backend.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final MigoClient migoClient;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, MigoClient migoClient, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.migoClient = migoClient;
        this.jwtUtil = jwtUtil;
    }

    public JwtResponse loginWithDni(String dni) throws MigoException {
        // Llamada a Apimigo
        MigoDniResponse response = migoClient.getPersonByDni(dni);

        // Buscar o crear usuario en DB
        User user = userRepository.findByDni(dni)
                .orElseGet(() -> userRepository.save(
                        new User(dni, response.getNombre())
                ));

        // Generar JWT
        String token = jwtUtil.generateToken(user.getDni());

        return new JwtResponse(
                token,
                user.getDni(),
                user.getNombre()
        );
    }
}
