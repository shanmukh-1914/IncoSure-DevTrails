package com.incosure.backend.service;

import com.incosure.backend.dto.UserRegistrationRequest;
import com.incosure.backend.entity.User;
import com.incosure.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(UserRegistrationRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already registered");
        });

        User user = User.builder()
            .name(request.name())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .location(request.location())
            .deliveryType(request.deliveryType())
            .zone(request.zone())
            .build();

        return userRepository.save(user);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    public User authenticateUser(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("Email and password are required");
        }

        User user = userRepository.findByEmail(email.trim())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String storedPassword = user.getPassword();
        boolean storedAsHash = storedPassword != null && (storedPassword.startsWith("$2a$")
            || storedPassword.startsWith("$2b$")
            || storedPassword.startsWith("$2y$"));

        boolean authenticated = storedAsHash
            ? passwordEncoder.matches(password, storedPassword)
            : password.equals(storedPassword);

        if (!authenticated) {
            throw new IllegalArgumentException("Invalid password");
        }

        // One-time migration path for legacy plain-text passwords.
        if (!storedAsHash) {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }

        return user;
    }
}
