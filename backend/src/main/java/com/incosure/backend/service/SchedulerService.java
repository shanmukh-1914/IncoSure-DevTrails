package com.incosure.backend.service;

import com.incosure.backend.entity.TriggerEvent;
import com.incosure.backend.entity.User;
import com.incosure.backend.repository.TriggerEventRepository;
import com.incosure.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final WeatherService weatherService;
    private final UserRepository userRepository;
    private final TriggerEventRepository triggerEventRepository;
    private final ClaimService claimService;

    @Scheduled(fixedDelayString = "${app.scheduler.monitor-interval-ms:30000}")
    public void monitorDisruptionsAndGenerateClaims() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            return;
        }

        Set<String> locations = users.stream()
            .map(User::getLocation)
            .filter(location -> location != null && !location.isBlank())
            .collect(Collectors.toSet());

        for (String location : locations) {
            WeatherService.WeatherSnapshot weather = weatherService.fetchWeatherByLocation(location);

            if (isDisruption(weather)) {
                TriggerEvent triggerEvent = triggerEventRepository.save(
                    TriggerEvent.builder()
                        .type(resolveTriggerType(weather))
                        .location(location)
                        .severity(resolveSeverity(weather))
                        .timestamp(LocalDateTime.now())
                        .build()
                );

                List<User> locationUsers = userRepository.findByLocationIgnoreCase(location);
                for (User user : locationUsers) {
                    claimService.generateClaim(user, triggerEvent);
                }
            }
        }
    }

    private boolean isDisruption(WeatherService.WeatherSnapshot weather) {
        String condition = weather.condition() == null ? "" : weather.condition().toLowerCase();
        return condition.contains("rain") || condition.contains("thunderstorm") || weather.temperature() >= 40.0;
    }

    private String resolveTriggerType(WeatherService.WeatherSnapshot weather) {
        String condition = weather.condition() == null ? "" : weather.condition().toLowerCase();
        if (condition.contains("rain") || condition.contains("thunderstorm")) {
            return "WEATHER_RAIN";
        }
        if (weather.temperature() >= 40.0) {
            return "WEATHER_HEAT";
        }
        return "WEATHER_OTHER";
    }

    private String resolveSeverity(WeatherService.WeatherSnapshot weather) {
        String condition = weather.condition() == null ? "" : weather.condition().toLowerCase();
        if (condition.contains("thunderstorm") || weather.temperature() >= 44.0) {
            return "HIGH";
        }
        if (condition.contains("rain") || weather.temperature() >= 40.0) {
            return "MEDIUM";
        }
        return "LOW";
    }
}
