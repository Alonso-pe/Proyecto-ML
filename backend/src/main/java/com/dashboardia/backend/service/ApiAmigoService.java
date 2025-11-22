package com.dashboardia.backend.service;

import com.dashboardia.backend.dto.DniResponse;
import org.springframework.stereotype.Service;

@Service
public class ApiAmigoService {

    public DniResponse buscarPorDni(String dni) {

        // 🔥 DATOS SIMULADOS — Pueden cambiarse o conectarse a tu DB
        if (dni.equals("12345678")) {
            return new DniResponse(
                    "12345678",
                    "Juan",
                    "Pérez",
                    "Av. Los Álamos 345 - Lima"
            );
        }

        if (dni.equals("87654321")) {
            return new DniResponse(
                    "87654321",
                    "Ana",
                    "Ramírez",
                    "Calle Italia 550 - Arequipa"
            );
        }

        // Si no se encuentra
        return null;
    }
}
