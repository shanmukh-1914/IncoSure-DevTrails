package com.incosure.backend.service;

import com.incosure.backend.entity.Policy;
import com.incosure.backend.entity.User;
import com.incosure.backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final UserService userService;
    private final PremiumService premiumService;

    public Policy createWeeklyPolicy(Long userId, Double coverageAmount) {
        User user = userService.getUserById(userId);

        double weeklyPremium = premiumService.calculatePremium(user);
        double resolvedCoverageAmount = coverageAmount == null ? 500.0 : coverageAmount;

        Policy existing = policyRepository.findByUser(user);
        if (existing != null) {
            existing.setWeeklyPremium(weeklyPremium);
            existing.setCoverageAmount(resolvedCoverageAmount);
            existing.setStatus("ACTIVE");
            return policyRepository.save(existing);
        }

        Policy policy = Policy.builder()
            .user(user)
            .weeklyPremium(weeklyPremium)
            .coverageAmount(resolvedCoverageAmount)
            .status("ACTIVE")
            .build();

        return policyRepository.save(policy);
    }
}
