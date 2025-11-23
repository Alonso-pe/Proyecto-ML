package com.dashboardia.backend.controller;

import com.dashboardia.backend.entity.Vote;
import com.dashboardia.backend.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class VoteController {

    private final VoteService voteService;

    @Autowired
    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    public static class VoteRequest {
        public String candidateId;
        public String voterId;

        public String getCandidateId() {
            return candidateId;
        }

        public void setCandidateId(String candidateId) {
            this.candidateId = candidateId;
        }

        public String getVoterId() {
            return voterId;
        }

        public void setVoterId(String voterId) {
            this.voterId = voterId;
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<?> submitVote(@RequestBody VoteRequest req) {
        if (req == null || req.candidateId == null || req.candidateId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "candidateId required"));
        }
        Vote saved = voteService.saveVoteAndNotify(req.candidateId.trim(), req.voterId);
        return ResponseEntity.created(URI.create("/vote/" + saved.getId())).body(saved);
    }

    @GetMapping("/admin/votes/summary")
    public ResponseEntity<List<Map<String, Object>>> summary() {
        Map<String, Long> summary = voteService.getSummary();
        List<Map<String, Object>> list = summary.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("candidateId", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/admin/votes/stream")
    public SseEmitter stream() {
        return voteService.subscribe();
    }

    // Debug helper: allow quick vote submission via GET for development/testing
    // (authenticated)
    @GetMapping("/debug/vote")
    public ResponseEntity<?> debugVote(@RequestParam String candidateId,
            @RequestParam(required = false) String voterId) {
        if (candidateId == null || candidateId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "candidateId required"));
        }
        Vote saved = voteService.saveVoteAndNotify(candidateId.trim(), voterId);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "candidateId", saved.getCandidateId()));
    }
}
