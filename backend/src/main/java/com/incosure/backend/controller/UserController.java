package com.incosure.backend.controller;

import com.incosure.backend.dto.UserRegistrationRequest;
import com.incosure.backend.dto.UserLoginRequest;
import com.incosure.backend.dto.UserResponse;
import com.incosure.backend.entity.User;
import com.incosure.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegistrationRequest request) {
        User user = userService.registerUser(request);

        UserResponse response = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getLocation(),
            user.getDeliveryType(),
            user.getZone()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserLoginRequest request) {
        User user = userService.authenticateUser(request.email(), request.password());

        UserResponse response = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getLocation(),
            user.getDeliveryType(),
            user.getZone()
        );

        return ResponseEntity.ok(response);
    }
}
