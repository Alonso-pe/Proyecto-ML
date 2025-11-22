package com.dashboardia.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;


@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {
@Id
@GeneratedValue
private UUID id;


@Column(unique = true, nullable = false)
private String email;


@Column(nullable = false)
private String password; // bcrypt hashed


@Column(name = "created_at", nullable = false)
private Instant createdAt = Instant.now();
}