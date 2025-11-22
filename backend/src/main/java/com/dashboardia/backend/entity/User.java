package com.dashboardia.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;


@Entity
@Table(name = "users", indexes = {@Index(columnList = "dni", name = "idx_users_dni")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
@Id
@GeneratedValue
private UUID id;


@Column(unique = true, length = 20, nullable = false)
private String dni;


@Column(name = "has_voted", nullable = false)
private boolean hasVoted = false;


@Column(name = "created_at", nullable = false)
private Instant createdAt = Instant.now();
}