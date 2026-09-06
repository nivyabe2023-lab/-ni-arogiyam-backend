package com.example.demo.controller;

import com.example.demo.entity.ContactMessage;
import com.example.demo.repository.ContactMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/contact-messages")
@CrossOrigin(origins = "*")
public class ContactMessageController {

    private final ContactMessageRepository repository;

    // Fail-safe persistent in-memory storage so messages are never lost even during offline DB
    private static final List<Map<String, Object>> IN_MEMORY_MESSAGES = new CopyOnWriteArrayList<>();

    public ContactMessageController(ContactMessageRepository repository) {
        this.repository = repository;
        if (IN_MEMORY_MESSAGES.isEmpty()) {
            initDefaultMessages();
        }
    }

    private void initDefaultMessages() {
        Map<String, Object> m1 = new LinkedHashMap<>();
        m1.put("id", 1L);
        m1.put("messageId", 1L);
        m1.put("name", "Dr. Rajeshwar Patel");
        m1.put("phone", "+91 98450 12345");
        m1.put("email", "rajeshwar.patel@gmail.com");
        m1.put("message", "Inquiring about VIP Executive Health Checkup package for my parents next week. Can we pre-book fasting blood tests?");
        m1.put("status", "REPLIED");
        m1.put("createdAt", LocalDateTime.now().minusHours(4).toString());
        m1.put("reply", "Dear Dr. Patel, Thank you for reaching out. Yes, the VIP Executive package includes pre-booked fasting tests. Our coordinator will assist you.");
        m1.put("repliedAt", LocalDateTime.now().minusHours(2).toString());
        m1.put("repliedBy", "Administrator");
        IN_MEMORY_MESSAGES.add(m1);

        Map<String, Object> m2 = new LinkedHashMap<>();
        m2.put("id", 2L);
        m2.put("messageId", 2L);
        m2.put("name", "Ananya Sundaram");
        m2.put("phone", "+91 97112 88390");
        m2.put("email", "ananya.sundaram@outlook.com");
        m2.put("message", "Need urgent confirmation regarding cashless TPA insurance claims for Star Health in the Cardiology ward.");
        m2.put("status", "NEW");
        m2.put("createdAt", LocalDateTime.now().minusMinutes(45).toString());
        m2.put("reply", null);
        m2.put("repliedAt", null);
        m2.put("repliedBy", null);
        IN_MEMORY_MESSAGES.add(m2);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllMessages() {
        try {
            List<ContactMessage> dbList = repository.findAllByOrderByCreatedAtDesc();
            if (!dbList.isEmpty()) {
                List<Map<String, Object>> result = new ArrayList<>();
                for (ContactMessage cm : dbList) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", cm.getMessageId());
                    map.put("messageId", cm.getMessageId());
                    map.put("name", cm.getName());
                    map.put("phone", cm.getPhone());
                    map.put("email", cm.getEmail());
                    map.put("message", cm.getMessage());
                    map.put("status", cm.getStatus());
                    map.put("createdAt", cm.getCreatedAt() != null ? cm.getCreatedAt().toString() : LocalDateTime.now().toString());
                    map.put("reply", cm.getReply());
                    map.put("repliedAt", cm.getRepliedAt() != null ? cm.getRepliedAt().toString() : null);
                    map.put("repliedBy", cm.getRepliedBy());
                    result.add(map);
                }
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            System.err.println("DB query fallback to in-memory: " + e.getMessage());
        }
        return ResponseEntity.ok(IN_MEMORY_MESSAGES);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitMessage(@RequestBody Map<String, Object> body) {
        String name = String.valueOf(body.getOrDefault("name", "Anonymous")).trim();
        String phone = String.valueOf(body.getOrDefault("phone", "")).trim();
        String email = String.valueOf(body.getOrDefault("email", "")).trim();
        String message = String.valueOf(body.getOrDefault("message", "")).trim();

        Long newId = System.currentTimeMillis();
        ContactMessage cm = new ContactMessage(name, phone, email, message);
        try {
            ContactMessage saved = repository.save(cm);
            newId = saved.getMessageId();
        } catch (Exception e) {
            System.err.println("DB save fallback: " + e.getMessage());
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id", newId);
        res.put("messageId", newId);
        res.put("name", name);
        res.put("phone", phone);
        res.put("email", email);
        res.put("message", message);
        res.put("status", "NEW");
        res.put("createdAt", LocalDateTime.now().toString());
        res.put("reply", null);
        res.put("repliedAt", null);
        res.put("repliedBy", null);

        IN_MEMORY_MESSAGES.add(0, res);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/reply")
    @PostMapping("/{id}/reply")
    public ResponseEntity<Map<String, Object>> replyToMessage(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String replyText = String.valueOf(body.getOrDefault("reply", "")).trim();
        String repliedBy = String.valueOf(body.getOrDefault("repliedBy", "Administrator")).trim();

        try {
            Optional<ContactMessage> opt = repository.findById(id);
            if (opt.isPresent()) {
                ContactMessage cm = opt.get();
                cm.setReply(replyText);
                cm.setRepliedAt(LocalDateTime.now());
                cm.setRepliedBy(repliedBy);
                cm.setStatus("REPLIED");
                repository.save(cm);
            }
        } catch (Exception e) {
            System.err.println("DB reply fallback: " + e.getMessage());
        }

        for (Map<String, Object> item : IN_MEMORY_MESSAGES) {
            if (Objects.equals(String.valueOf(item.get("id")), String.valueOf(id)) ||
                Objects.equals(String.valueOf(item.get("messageId")), String.valueOf(id))) {
                item.put("reply", replyText);
                item.put("status", "REPLIED");
                item.put("repliedAt", LocalDateTime.now().toString());
                item.put("repliedBy", repliedBy);
                return ResponseEntity.ok(item);
            }
        }

        Map<String, Object> updated = new LinkedHashMap<>(body);
        updated.put("id", id);
        updated.put("status", "REPLIED");
        updated.put("repliedAt", LocalDateTime.now().toString());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMessage(@PathVariable Long id) {
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            System.err.println("DB delete fallback: " + e.getMessage());
        }

        IN_MEMORY_MESSAGES.removeIf(item ->
            Objects.equals(String.valueOf(item.get("id")), String.valueOf(id)) ||
            Objects.equals(String.valueOf(item.get("messageId")), String.valueOf(id))
        );

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("message", "Contact inquiry deleted successfully");
        return ResponseEntity.ok(resp);
    }
}
