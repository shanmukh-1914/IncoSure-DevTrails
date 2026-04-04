package com.incosure.backend.repository;

import com.incosure.backend.entity.Claim;
import com.incosure.backend.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByUser(User user);
}
