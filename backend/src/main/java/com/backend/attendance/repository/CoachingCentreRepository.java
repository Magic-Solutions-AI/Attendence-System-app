package com.backend.attendance.repository;

import com.backend.attendance.model.CoachingCentre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoachingCentreRepository extends JpaRepository<CoachingCentre, String> {
    List<CoachingCentre> findByIsActive(Boolean isActive);
}
