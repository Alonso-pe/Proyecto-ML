package com.dashboardia.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;


@Entity
@Table(name = "votes", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {
@Id
@GeneratedValue
private UUID id;


@Column(name = "user_id", nullable = false)
private UUID userId;


@Column(name = "candidate_id", nullable = false)
private UUID candidateId;


@Column(name = "created_at", nullable = false)
private Instant createdAt = Instant.now();
}