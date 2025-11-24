package com.dashboardia.backend.service;

import com.dashboardia.backend.dto.VotoRequest;
import com.dashboardia.backend.entity.*;
import com.dashboardia.backend.exceptions.AlreadyVotedException;
import com.dashboardia.backend.exceptions.BadRequestException;
import com.dashboardia.backend.exceptions.NotFoundException;
import com.dashboardia.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VotoService {
    private final VotoRepository votoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CandidatoPresidencialRepository candidatoPresidencialRepository;
    private final CandidatoAlcaldiaRepository candidatoAlcaldiaRepository;
    private final UsuarioService usuarioService;

    @Transactional
    public void registrarVoto(VotoRequest votoRequest, HttpServletRequest request) {
        // 1. Validar que el usuario existe y no ha votado
        Usuario usuario = usuarioRepository.findByDni(votoRequest.getDni())
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado con DNI: " + votoRequest.getDni()));
        
        if (usuario.isHaVotado()) {
            throw new AlreadyVotedException("El usuario ya ha emitido su voto");
        }

        // 2. Validar que los candidatos existen
        CandidatoPresidencial candidatoPresidencial = candidatoPresidencialRepository.findById(votoRequest.getCandidatoPresidencialId())
            .orElseThrow(() -> new NotFoundException("Candidato presidencial no encontrado"));
        
        CandidatoAlcaldia candidatoAlcaldia1 = candidatoAlcaldiaRepository.findById(votoRequest.getCandidatoAlcaldia1Id())
            .orElseThrow(() -> new NotFoundException("Primer candidato a alcaldía no encontrado"));
        
        CandidatoAlcaldia candidatoAlcaldia2 = candidatoAlcaldiaRepository.findById(votoRequest.getCandidatoAlcaldia2Id())
            .orElseThrow(() -> new NotFoundException("Segundo candidato a alcaldía no encontrado"));

        // 3. Validar que los candidatos de alcaldía son del mismo distrito
        if (!candidatoAlcaldia1.getDistrito().equals(candidatoAlcaldia2.getDistrito())) {
            throw new BadRequestException("Los candidatos a alcaldía deben ser del mismo distrito");
        }

        // 4. Validar que el usuario está votando en su distrito
        if (!usuario.getDistrito().equalsIgnoreCase(candidatoAlcaldia1.getDistrito())) {
            throw new BadRequestException("Solo puede votar por candidatos de su distrito");
        }

        // 5. Validar que no se vote dos veces por el mismo candidato de alcaldía
        if (votoRequest.getCandidatoAlcaldia1Id().equals(votoRequest.getCandidatoAlcaldia2Id())) {
            throw new BadRequestException("No puede votar dos veces por el mismo candidato a alcaldía");
        }

        // 6. Crear y guardar el voto
        Voto voto = new Voto();
        voto.setUsuario(usuario);
        voto.setCandidatoPresidencial(candidatoPresidencial);
        voto.setCandidatoAlcaldia1(candidatoAlcaldia1);
        voto.setCandidatoAlcaldia2(candidatoAlcaldia2);
        voto.setFechaVoto(LocalDateTime.now());
        voto.setIpVoto(getClientIp(request));

        votoRepository.save(voto);

        // 7. Marcar al usuario como que ya votó
        usuarioService.marcarComoVotado(usuario.getDni());
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";
        if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            }
        }
        return remoteAddr;
    }
}