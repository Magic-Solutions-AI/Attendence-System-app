package com.backend.attendance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String studentName;
    private String gender;
    private LocalDate dateOfBirth;
    private String schoolName;
    private String standard;

    private String parentName;
    private String parentPhone;
    private String parentAltPhone;

    private String registerNumber;

    private String batchName;
    private LocalTime batchStartTime;
    private LocalTime batchEndTime;

    private String tutorId;

    private String coachingCentreId;

    private String address;

    @Builder.Default
    private Boolean isActive = true;
    private LocalDate joinedDate;
    private LocalDate leftDate;

    private String createdBy;

    @Builder.Default
    private Boolean faceRegistered = false;
    @Convert(converter = DoubleListConverter.class)
    @Column(columnDefinition = "TEXT")
    private java.util.List<Double> faceEmbedding;

    @Builder.Default
    private Boolean fingerprintRegistered = false;
    @Column(columnDefinition = "TEXT")
    private String fingerprintTemplate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
