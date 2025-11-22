package com.dashboardia.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dashboardia.backend.external.migo.MigoClient;
import com.dashboardia.backend.external.migo.MigoDniResponse;
import com.dashboardia.backend.external.migo.MigoException;

@Service
public class UserService {

    @Autowired
    private MigoClient migoClient;

    public MigoDniResponse verificarDatosPorDni(String dni) throws MigoException {
        return migoClient.consultarDni(dni);
    }
}
