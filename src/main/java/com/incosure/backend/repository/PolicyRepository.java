package com.incosure.backend.repository;

import com.incosure.backend.entity.Policy;
import com.incosure.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Policy findByUser(User user);
}
