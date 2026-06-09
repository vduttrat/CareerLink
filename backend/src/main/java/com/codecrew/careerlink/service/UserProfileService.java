package com.codecrew.careerlink.service;

import com.codecrew.careerlink.dto.UserProfileDto;
import com.codecrew.careerlink.entity.UserProfile;
import com.codecrew.careerlink.exception.ResourceNotFoundException;
import com.codecrew.careerlink.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private UserProfileDto convertToDto(UserProfile entity) {
        return new UserProfileDto(
                entity.getId(),
                entity.getName(),
                entity.getProfession(),
                entity.getDetails(),
                entity.getConnectedUsernames()
        );
    }
}
