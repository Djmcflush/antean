-- Create readiness_scores table
CREATE TABLE IF NOT EXISTS readiness_scores (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id),
    date DATE NOT NULL,
    personnel_readiness FLOAT,
    equipment_readiness FLOAT,
    training_readiness FLOAT,
    supplies_readiness FLOAT,
    overall_readiness FLOAT
);