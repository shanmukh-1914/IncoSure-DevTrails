package com.incosure.backend.repository;

import com.incosure.backend.entity.TriggerEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TriggerEventRepository extends JpaRepository<TriggerEvent, Long> {
}
