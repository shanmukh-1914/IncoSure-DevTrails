package com.incosure.backend.dto;

public record PolicyResponse(
    Long id,
    Long userId,
    Double weeklyPremium,
    Double coverageAmount,
    String status
) {
}
