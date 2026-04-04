package com.incosure.backend.dto;

public record UserResponse(
    Long id,
    String name,
    String email,
    String location,
    String deliveryType,
    String zone
) {
}
