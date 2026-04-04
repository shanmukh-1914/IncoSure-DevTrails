package com.incosure.backend.service;

import com.incosure.backend.entity.Claim;
import com.incosure.backend.entity.Policy;
import com.incosure.backend.entity.TriggerEvent;
import com.incosure.backend.entity.User;
import com.incosure.backend.repository.ClaimRepository;
import com.incosure.backend.repository.PolicyRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final UserService userService;

    public Claim generateClaim(User user, TriggerEvent trigger) {
        Policy policy = policyRepository.findByUser(user);

        if (policy == null || !"ACTIVE".equalsIgnoreCase(policy.getStatus())) {
            return null;
        }

        double payoutAmount = switch (trigger.getSeverity().toUpperCase()) {
            case "HIGH" -> 500.0;
            case "MEDIUM" -> 350.0;
            default -> 250.0;
        };

        Claim claim = Claim.builder()
            .user(user)
            .policy(policy)
            .triggerEvent(trigger)
            .payoutAmount(payoutAmount)
            .status("APPROVED")
            .createdAt(LocalDateTime.now())
            .build();

        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public List<Claim> getClaimsByUserId(Long userId) {
        User user = userService.getUserById(userId);
        return claimRepository.findByUser(user);
    }
}
