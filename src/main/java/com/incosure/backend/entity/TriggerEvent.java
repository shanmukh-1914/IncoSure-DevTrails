package com.incosure.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trigger_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TriggerEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String type;

    @Column(nullable = false, length = 120)
    private String location;

    @Column(nullable = false, length = 40)
    private String severity;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
