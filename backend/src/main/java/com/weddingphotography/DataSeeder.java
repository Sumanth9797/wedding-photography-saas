package com.weddingphotography;

import com.weddingphotography.model.Event;
import com.weddingphotography.model.EventAssignment;
import com.weddingphotography.model.User;
import com.weddingphotography.repository.EventAssignmentRepository;
import com.weddingphotography.repository.EventRepository;
import com.weddingphotography.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Seeds demo data for the dev profile.
 * Activated only when spring.profiles.active=dev
 *
 * Seeded data:
 *   - Photographer: demo@photographer.com (OTP: check console logs)
 *   - Editor:       demo@editor.com       (OTP: check console logs)
 *   - Event:        Rahul & Priya Wedding
 *     Gallery token: demo-gallery-token-001
 *     PIN:           1234
 */
@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private EventAssignmentRepository assignmentRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Dev seed: data already exists, skipping.");
            return;
        }

        // Create demo photographer
        User photographer = User.builder()
            .name("Demo Photographer")
            .email("demo@photographer.com")
            .role(User.UserRole.PHOTOGRAPHER)
            .isActive(true)
            .build();
        photographer = userRepository.save(photographer);

        // Create demo editor
        User editor = User.builder()
            .name("Demo Editor")
            .email("demo@editor.com")
            .role(User.UserRole.EDITOR)
            .isActive(true)
            .build();
        editor = userRepository.save(editor);

        // Create demo event
        Event event = Event.builder()
            .photographer(photographer)
            .title("Rahul & Priya Wedding")
            .weddingDate(LocalDate.of(2024, 12, 15))
            .brideName("Priya Sharma")
            .brideEmail("priya@example.com")
            .bridePhone("9876543210")
            .groomName("Rahul Kumar")
            .groomEmail("rahul@example.com")
            .groomPhone("9876543211")
            .galleryToken("demo-gallery-token-001")
            .pinCode("1234")
            .status(Event.EventStatus.ACTIVE)
            .description("A beautiful wedding celebration")
            .venue("The Grand Ballroom, Mumbai")
            .build();
        event = eventRepository.save(event);

        // Assign editor to event
        EventAssignment assignment = EventAssignment.builder()
            .event(event)
            .editor(editor)
            .assignedBy(photographer)
            .status(EventAssignment.AssignmentStatus.PENDING)
            .notes("Please edit all selected photos with warm tones")
            .build();
        assignmentRepository.save(assignment);

        logger.info("==========================================");
        logger.info("DEV SEED DATA CREATED:");
        logger.info("  Photographer: demo@photographer.com");
        logger.info("  Editor:       demo@editor.com");
        logger.info("  Event:        Rahul & Priya Wedding");
        logger.info("  Gallery URL:  http://localhost:5173/gallery/demo-gallery-token-001");
        logger.info("  Gallery PIN:  1234");
        logger.info("==========================================");
        logger.info("To get OTP: call POST /api/auth/send-otp with contact=demo@photographer.com");
        logger.info("OTP will be printed in console logs.");
        logger.info("==========================================");
    }
}
