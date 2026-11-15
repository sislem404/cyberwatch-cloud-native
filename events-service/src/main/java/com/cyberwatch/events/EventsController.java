package com.cyberwatch.events;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class EventsController {

    @GetMapping("/events")
    public List<Map<String, Object>> getEvents() {
        return List.of(
            Map.of(
                "id", 1,
                "type", "LOGIN_FAILED",
                "severity", "HIGH"
            ),
            Map.of(
                "id", 2,
                "type", "LOGIN_SUCCESS",
                "severity", "LOW"
            )
        );
    }
}