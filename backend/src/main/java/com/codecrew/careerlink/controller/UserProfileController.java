package com.codecrew.careerlink.controller;

import com.codecrew.careerlink.dto.UserProfileDto;
import com.codecrew.careerlink.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
