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
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String studentId;
    private String tutorId;

    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private LocalTime checkInTime;
    private LocalTime checkOutTime;

    private String remarks;

    private String totalTimeSpent; // e.g. "2h 30m" – calculated on checkout

    @Builder.Default
    private Boolean checkInSmsSent = false;
    @Builder.Default
    private Boolean checkOutSmsSent = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
