package com.dashboardia.backend.security;

import com.dashboardia.backend.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class UserPrincipal implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String dni;
    private String nombre;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String dni, String nombre, String password,
                        Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.dni = dni;
        this.nombre = nombre;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal create(Usuario usuario) {
        // Siempre asignamos solo el rol USER
        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_USER")
        );

        return new UserPrincipal(
            usuario.getId(),
            usuario.getDni(),
            usuario.getNombre(),
            usuario.getDni(), // Usamos el DNI como contraseña
            authorities
        );
    }

    // Resto de los métodos de la clase...
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return dni;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}