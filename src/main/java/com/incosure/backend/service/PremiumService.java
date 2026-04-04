package com.incosure.backend.service;

import com.incosure.backend.entity.User;
import org.springframework.stereotype.Service;

@Service
public class PremiumService {

    private static final double BASE_WEEKLY_PREMIUM = 50.0;

    public double calculatePremium(User user) {
        double premium = BASE_WEEKLY_PREMIUM;

        String zone = user.getZone() == null ? "" : user.getZone().toLowerCase();
        String location = user.getLocation() == null ? "" : user.getLocation().toLowerCase();

        // Location/zone risk modifiers
        if (zone.contains("zone 1") || location.contains("safe")) {
            premium -= 10;
        } else if (zone.contains("zone 5") || location.contains("flood")) {
            premium += 30;
        }

        // Delivery profile as weather exposure proxy
        String deliveryType = user.getDeliveryType() == null ? "" : user.getDeliveryType().toLowerCase();
        if (deliveryType.contains("swiggy") || deliveryType.contains("zomato")) {
            premium += 8;
        } else if (deliveryType.contains("amazon")) {
            premium += 4;
        }

        // Keep weekly premium bounded and realistic
        return Math.max(30, Math.min(180, premium));
    }
}
