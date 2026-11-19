package com.cyberwatch.events;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventsController {

    private final SecurityEventRepository repository;

    public EventsController(SecurityEventRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/events")
    public List<SecurityEvent> getEvents() {
        return repository.findAll();
    }

    @PostMapping("/events")
    public SecurityEvent createEvent(@RequestBody CreateEventRequest request) {

        SecurityEvent event = new SecurityEvent();

        event.setType(request.type());
        event.setSeverity(request.severity());

        return repository.save(event);
    }

    public record CreateEventRequest(String type, String severity) {}
}