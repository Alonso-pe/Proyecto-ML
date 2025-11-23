package com.dashboardia.backend.repository;

import com.dashboardia.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    @Query("SELECT v.candidateId AS candidateId, COUNT(v) AS cnt FROM Vote v GROUP BY v.candidateId")
    List<Object[]> countVotesByCandidate();
}
