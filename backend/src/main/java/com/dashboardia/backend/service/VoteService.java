package com.dashboardia.backend.service;

import com.dashboardia.backend.entity.Vote;
import com.dashboardia.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class VoteService {

    private final VoteRepository voteRepository;

    @Autowired
    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public Vote saveVote(String candidateId, String voterId) {
        Vote v = new Vote(candidateId, voterId);
        return voteRepository.save(v);
    }

    public Map<String, Long> getSummary() {
        List<Object[]> rows = voteRepository.countVotesByCandidate();
        Map<String, Long> result = new HashMap<>();
        for (Object[] r : rows) {
            String candidateId = (String) r[0];
            Long cnt = (Long) r[1];
            result.put(candidateId, cnt);
        }
        return result;
    }

    // SSE support
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        try {
            emitter.send(SseEmitter.event().name("init").data(getSummary()));
        } catch (Exception e) {
            // ignore send errors for init
        }
        return emitter;
    }

    private void notifyClients() {
        Map<String, Long> summary = getSummary();
        List<SseEmitter> dead = new ArrayList<>();
        for (SseEmitter e : emitters) {
            try {
                e.send(SseEmitter.event().name("update").data(summary));
            } catch (Exception ex) {
                dead.add(e);
            }
        }
        emitters.removeAll(dead);
    }

    // wrap saveVote to notify subscribers
    public Vote saveVoteAndNotify(String candidateId, String voterId) {
        Vote saved = saveVote(candidateId, voterId);
        notifyClients();
        return saved;
    }
}
