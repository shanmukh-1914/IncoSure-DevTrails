package com.incosure.backend.dto;

import java.time.LocalDateTime;

public record ClaimResponse(
    Long id,
    Long userId,
    Long policyId,
    Long triggerEventId,
    Double payoutAmount,
    String status,
    LocalDateTime createdAt
) {
}
