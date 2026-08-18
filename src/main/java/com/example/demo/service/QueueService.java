package com.example.demo.service;

import com.example.demo.entity.QueueEntry;
import com.example.demo.repository.QueueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QueueService {

    private final QueueRepository queueRepository;

    public QueueService(QueueRepository queueRepository) {
        this.queueRepository = queueRepository;
    }

    // Add patient to queue
    public QueueEntry addToQueue(QueueEntry queueEntry) {

        String emergencyLevel =
                queueEntry.getVisit().getEmergencyLevel();

        if (emergencyLevel == null) {
            emergencyLevel = "LOW";
        }

        if ("HIGH".equalsIgnoreCase(emergencyLevel)) {
            queueEntry.setPriority(1);
        }
        else if ("MEDIUM".equalsIgnoreCase(emergencyLevel)) {
            queueEntry.setPriority(2);
        }
        else {
            queueEntry.setPriority(3);
        }

        queueEntry.setAddedTime(LocalDateTime.now());
        queueEntry.setStatus("WAITING");

        return queueRepository.save(queueEntry);
    }

    // Get queue in priority order
    public List<QueueEntry> getAllQueueEntries() {
        return queueRepository
                .findAllByOrderByPriorityAscAddedTimeAsc();
    }

    // Get queue entry by ID
    public QueueEntry getQueueEntryById(Long queueId) {
        return queueRepository.findById(queueId)
                .orElse(null);
    }

    // Delete queue entry
    public void deleteQueueEntry(Long queueId) {
        queueRepository.deleteById(queueId);
    }
}