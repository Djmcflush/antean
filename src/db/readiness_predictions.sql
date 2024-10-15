-- Create the readiness_predictions table
CREATE TABLE IF NOT EXISTS readiness_predictions (
    id SERIAL PRIMARY KEY,
    unit_id VARCHAR(255) NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    readiness_score INTEGER NOT NULL CHECK (readiness_score >= 0 AND readiness_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on unit_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_readiness_predictions_unit_id ON readiness_predictions(unit_id);

-- Create an index on start_date for faster date range queries
CREATE INDEX IF NOT EXISTS idx_readiness_predictions_start_date ON readiness_predictions(start_date);
