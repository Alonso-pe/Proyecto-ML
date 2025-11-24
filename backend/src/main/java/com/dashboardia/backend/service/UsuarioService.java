// UsuarioService.java
package com.dashboardia.backend.service;

import com.dashboardia.backend.dto.UsuarioResponse;
import com.dashboardia.backend.entity.Usuario;
import com.dashboardia.backend.exceptions.NotFoundException;
import com.dashboardia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public UsuarioResponse validarDni(String dni) {
        Usuario usuario = usuarioRepository.findByDni(dni)
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado con DNI: " + dni));
        
        return mapToUsuarioResponse(usuario);
    }

    @Transactional
    public void marcarComoVotado(String dni) {
        Usuario usuario = usuarioRepository.findByDni(dni)
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado con DNI: " + dni));
        
        usuario.setHaVotado(true);
        usuarioRepository.save(usuario);
    }

    private UsuarioResponse mapToUsuarioResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setDni(usuario.getDni());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setDistrito(usuario.getDistrito());
        response.setDepartamento(usuario.getDepartamento());
        response.setHaVotado(usuario.isHaVotado());
        response.setFechaCreacion(usuario.getFechaCreacion());
        return response;
    }
}