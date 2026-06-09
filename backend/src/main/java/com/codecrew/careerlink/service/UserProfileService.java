package com.codecrew.careerlink.service;

import com.codecrew.careerlink.dto.UserProfileDto;
import com.codecrew.careerlink.entity.UserProfile;
import com.codecrew.careerlink.exception.ResourceNotFoundException;
import com.codecrew.careerlink.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public List<UserProfileDto> getAllProfiles() {
        return userProfileRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserProfileDto createProfile(UserProfileDto dto) {
        UserProfile profile = new UserProfile(dto.getName(), dto.getProfession(), dto.getDetails());
        UserProfile saved = userProfileRepository.save(profile);
        return convertToDto(saved);
    }

    @Transactional
    public UserProfileDto toggleConnection(Long profileId, String username) {
        UserProfile profile = userProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));

        if (profile.getConnectedUsernames().contains(username)) {
            profile.getConnectedUsernames().remove(username);
        } else {
            profile.getConnectedUsernames().add(username);
        }

        UserProfile saved = userProfileRepository.save(profile);
        return convertToDto(saved);
    }

    @Transactional
    public UserProfileDto uploadResume(String username, MultipartFile file) throws IOException {
        
        UserProfile profile = userProfileRepository.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase(username))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No profile found for username: " + username + ". Please create a profile first."));

        profile.setResumeData(file.getBytes());
        profile.setResumeFilename(file.getOriginalFilename());
        UserProfile saved = userProfileRepository.save(profile);
        return convertToDto(saved);
    }

    public UserProfile getResumeForDownload(Long profileId, String requestingUsername) {
        UserProfile profile = userProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));

        if (profile.getResumeData() == null) {
            throw new ResourceNotFoundException("This user has not uploaded a resume.");
        }

        
        if (!profile.getConnectedUsernames().contains(requestingUsername)) {
            throw new SecurityException("You must be connected to this user to download their resume.");
        }

        return profile;
    }

    private UserProfileDto convertToDto(UserProfile entity) {
        return new UserProfileDto(
                entity.getId(),
                entity.getName(),
                entity.getProfession(),
                entity.getDetails(),
                entity.getConnectedUsernames(),
                entity.getResumeData() != null
        );
    }
}

