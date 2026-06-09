package com.codecrew.careerlink.controller;

import com.codecrew.careerlink.dto.UserProfileDto;
import com.codecrew.careerlink.entity.UserProfile;
import com.codecrew.careerlink.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<List<UserProfileDto>> getAllProfiles() {
        return ResponseEntity.ok(userProfileService.getAllProfiles());
    }

    @PostMapping
    public ResponseEntity<UserProfileDto> createProfile(@Valid @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userProfileService.createProfile(dto));
    }

    @PostMapping("/{id}/connect")
    public ResponseEntity<UserProfileDto> toggleConnection(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(userProfileService.toggleConnection(id, username));
    }

    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            String username = authentication.getName();
            UserProfileDto updated = userProfileService.uploadResume(username, file);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process resume file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<?> downloadResume(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            String requestingUsername = authentication.getName();
            UserProfile profile = userProfileService.getResumeForDownload(id, requestingUsername);

            String filename = profile.getResumeFilename() != null ? profile.getResumeFilename() : "resume.pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(profile.getResumeData());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

