package com.backend.attendance.model;

import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "coaching_centres")
public class CoachingCentre {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String centreName;
    private String ownerName;
    private String adminId;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    private String address;

    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
