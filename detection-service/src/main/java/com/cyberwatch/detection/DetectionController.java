package com.cyberwatch.detection;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class DetectionController {

    private final RestClient eventsClient;

    public DetectionController(
            RestClient.Builder builder,
            @Value("${EVENTS_SERVICE_URL:http://localhost:8081}") String eventsUrl) {

        this.eventsClient = builder.baseUrl(eventsUrl).build();
    }

    @GetMapping("/alerts")
    public List<Alert> getAlerts() {

        
        Event[] events = eventsClient.get()
                .uri("/events")
                .retrieve()
                .body(Event[].class);

        List<Alert> alerts = new ArrayList<>();

        
        if (events != null) {
            for (Event event : events) {
                if ("LOGIN_FAILED".equals(event.type())) {
                    alerts.add(new Alert(event.id(), "Connexion échouée détectée"));
                }
            }
        }

        return alerts;
    }

    public record Event(int id, String type, String severity) {}
    public record Alert(int eventId, String message) {}
}