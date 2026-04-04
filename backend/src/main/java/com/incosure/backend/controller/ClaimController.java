package com.incosure.backend.controller;

import com.incosure.backend.dto.ClaimResponse;
import com.incosure.backend.entity.Claim;
import com.incosure.backend.service.ClaimService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping
    public List<ClaimResponse> getClaims(@RequestParam(required = false) Long userId) {
        List<Claim> claims = (userId == null)
            ? claimService.getAllClaims()
            : claimService.getClaimsByUserId(userId);

        return claims.stream()
            .map(claim -> new ClaimResponse(
                claim.getId(),
                claim.getUser().getId(),
                claim.getPolicy().getId(),
                claim.getTriggerEvent().getId(),
                claim.getPayoutAmount(),
                claim.getStatus(),
                claim.getCreatedAt()
            ))
            .toList();
    }
}
