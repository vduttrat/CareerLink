package com.codecrew.careerlink.service;

import com.codecrew.careerlink.dto.UserProfileDto;
import com.codecrew.careerlink.entity.UserProfile;
import com.codecrew.careerlink.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllProfiles_ShouldReturnList() {
        UserProfile profile = new UserProfile("John Doe", "Developer", "LIT101");
        profile.setId(1L);
        when(userProfileRepository.findAll()).thenReturn(List.of(profile));

        List<UserProfileDto> result = userProfileService.getAllProfiles();

        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getName());
        verify(userProfileRepository, times(1)).findAll();
    }

    @Test
    void createProfile_ShouldSaveProfile() {
        UserProfileDto dto = new UserProfileDto(null, "Jane Doe", "Designer", "LIT102", Set.of());
        UserProfile profile = new UserProfile("Jane Doe", "Designer", "LIT102");
        profile.setId(2L);
        
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(profile);

        UserProfileDto result = userProfileService.createProfile(dto);

        assertNotNull(result.getId());
        assertEquals("Jane Doe", result.getName());
        verify(userProfileRepository, times(1)).save(any(UserProfile.class));
    }

    @Test
    void toggleConnection_ShouldAddOrRemoveUsername() {
        UserProfile profile = new UserProfile("John Doe", "Developer", "LIT101");
        profile.setId(1L);
        when(userProfileRepository.findById(1L)).thenReturn(Optional.of(profile));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(i -> i.getArguments()[0]);

        // Toggle connection once (add)
        UserProfileDto resultAdd = userProfileService.toggleConnection(1L, "user1");
        assertTrue(resultAdd.getConnectedUsernames().contains("user1"));

        // Toggle connection twice (remove)
        UserProfileDto resultRemove = userProfileService.toggleConnection(1L, "user1");
        assertFalse(resultRemove.getConnectedUsernames().contains("user1"));
    }
}
