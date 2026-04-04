package com.incosure.backend.dto;

public record UserLoginRequest(
    String email,
    String password
) {
}
