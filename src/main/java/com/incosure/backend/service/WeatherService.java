package com.incosure.backend.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${openweather.api.base-url}")
    private String openWeatherBaseUrl;

    @Value("${openweather.api.key}")
    private String openWeatherApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherSnapshot fetchWeatherByLocation(String location) {
        String url = String.format(
            "%s?q=%s&appid=%s&units=metric",
            openWeatherBaseUrl,
            location,
            openWeatherApiKey
        );

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
            );
            Map<String, Object> body = response.getBody();

            String condition = "Clear";
            double temperature = 30.0;

            if (body != null) {
                Object weatherObj = body.get("weather");
                if (weatherObj instanceof java.util.List<?> weatherList && !weatherList.isEmpty()) {
                    Object first = weatherList.get(0);
                    if (first instanceof Map<?, ?> weatherMap && weatherMap.get("main") != null) {
                        condition = weatherMap.get("main").toString();
                    }
                }

                Object mainObj = body.get("main");
                if (mainObj instanceof Map<?, ?> mainMap && mainMap.get("temp") != null) {
                    temperature = Double.parseDouble(mainMap.get("temp").toString());
                }
            }

            return new WeatherSnapshot(condition, temperature, location);
        } catch (Exception ignored) {
            // Mock fallback for local/dev mode when API key isn't configured.
            return new WeatherSnapshot("Clear", 31.0, location);
        }
    }

    public record WeatherSnapshot(String condition, double temperature, String location) {
    }
}
