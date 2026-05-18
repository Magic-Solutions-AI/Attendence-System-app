package com.backend.attendance.repository;
import com.backend.attendance.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByTutorIdOrderByTimestampDesc(String tutorId);
    List<Notification> findByTutorIdAndIsReadFalse(String tutorId);
}
