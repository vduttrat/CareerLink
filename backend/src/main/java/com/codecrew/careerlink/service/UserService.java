package com.codecrew.careerlink.service;

import com.codecrew.careerlink.config.JwtService;
import com.codecrew.careerlink.dto.AuthRequest;
import com.codecrew.careerlink.dto.AuthResponse;
import com.codecrew.careerlink.dto.RegisterRequest;
import com.codecrew.careerlink.entity.User;
import com.codecrew.careerlink.entity.UserProfile;
import com.codecrew.careerlink.repository.UserRepository;
import com.codecrew.careerlink.repository.UserProfileRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public UserService(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "ROLE_USER"
        );
        userRepository.save(user);

        
        String profession = request.getDetails();
        if (profession == null || profession.trim().isEmpty()) {
            profession = "Professional";
        }
        String details = "Professional Account";
        UserProfile profile = new UserProfile(request.getUsername(), profession, details);
        userProfileRepository.save(profile);

        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
            user.setWelcomeEmailSent(true);
            userRepository.save(user);
        }

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, user.getUsername(), user.getRole(), request.getDetails());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.isWelcomeEmailSent() && user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
            user.setWelcomeEmailSent(true);
            userRepository.save(user);
        }

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, user.getUsername(), user.getRole(), "Professional Account");
    }
}
