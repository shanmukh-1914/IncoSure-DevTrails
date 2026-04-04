package com.incosure.backend.dto;

public record UserRegistrationRequest(
    String name,
    String email,
    String password,
    String location,
    String deliveryType,
    String zone
) {
}
