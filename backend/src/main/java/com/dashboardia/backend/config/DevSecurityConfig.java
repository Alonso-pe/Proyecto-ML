package com.dashboardia.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;

@Configuration
@Profile("dev")
public class DevSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/h2-console/**").permitAll()
                        // Allow admin summary and stream and vote endpoints in dev without auth to
                        // simplify local testing
                        .requestMatchers("/admin/votes/**").permitAll()
                        .requestMatchers("/vote").permitAll()
                        .anyRequest().permitAll())
                .httpBasic();

        // Allow frames (for H2 console)
        http.headers().frameOptions().disable();

        return http.build();
    }
}
