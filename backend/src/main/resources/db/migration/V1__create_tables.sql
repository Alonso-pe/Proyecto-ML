-- Migration V1: create votes and errores_csv tables

CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  candidate_id VARCHAR(255) NOT NULL,
  voter_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);

CREATE TABLE IF NOT EXISTS errores_csv (
  id BIGSERIAL PRIMARY KEY,
  error_descripcion TEXT,
  archivo VARCHAR(255),
  fecha TIMESTAMPTZ DEFAULT now()
);
