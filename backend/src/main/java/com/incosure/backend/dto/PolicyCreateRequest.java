package com.incosure.backend.dto;

public record PolicyCreateRequest(
    Long userId,
    Double coverageAmount
) {
}
