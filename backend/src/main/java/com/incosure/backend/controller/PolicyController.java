package com.incosure.backend.controller;

import com.incosure.backend.dto.PolicyCreateRequest;
import com.incosure.backend.dto.PolicyResponse;
import com.incosure.backend.entity.Policy;
import com.incosure.backend.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping("/create")
    public ResponseEntity<PolicyResponse> createPolicy(@RequestBody PolicyCreateRequest request) {
        Policy policy = policyService.createWeeklyPolicy(request.userId(), request.coverageAmount());

        PolicyResponse response = new PolicyResponse(
            policy.getId(),
            policy.getUser().getId(),
            policy.getWeeklyPremium(),
            policy.getCoverageAmount(),
            policy.getStatus()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
