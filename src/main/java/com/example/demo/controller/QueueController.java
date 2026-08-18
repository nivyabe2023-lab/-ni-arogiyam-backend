package com.example.demo.controller;

import com.example.demo.entity.QueueEntry;
import com.example.demo.service.QueueService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    // =========================================================
    // ADD PATIENT TO QUEUE
    // =========================================================

    @PostMapping
    public ResponseEntity<QueueEntry> addToQueue(
            @RequestBody QueueEntry queueEntry) {

        QueueEntry savedEntry =
                queueService.addToQueue(queueEntry);

        return ResponseEntity.ok(savedEntry);
    }

    // =========================================================
    // GET ALL QUEUE ENTRIES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<QueueEntry>>
    getAllQueueEntries() {

        return ResponseEntity.ok(
                queueService.getAllQueueEntries()
        );
    }

    // =========================================================
    // GET QUEUE ENTRY BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<QueueEntry>
    getQueueEntryById(
            @PathVariable Long id) {

        QueueEntry entry =
                queueService.getQueueEntryById(id);

        if (entry == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(entry);
    }

    // =========================================================
    // DELETE QUEUE ENTRY
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteQueueEntry(
            @PathVariable Long id) {

        queueService.deleteQueueEntry(id);

        return ResponseEntity.noContent().build();
    }
}