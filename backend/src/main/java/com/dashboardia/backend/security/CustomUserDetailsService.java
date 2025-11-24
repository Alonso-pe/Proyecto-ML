// src/main/java/com/dashboardia/backend/security/CustomUserDetailsService.java
package com.dashboardia.backend.security;

import com.dashboardia.backend.entity.Usuario;
import com.dashboardia.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String dni) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByDni(dni)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("Usuario no encontrado con DNI: " + dni));

        return UserPrincipal.create(usuario);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("Usuario no encontrado con ID: " + id));

        return UserPrincipal.create(usuario);
    }
}