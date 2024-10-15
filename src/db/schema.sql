-- Create units table
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    parent_id INTEGER REFERENCES units(id),
    specialty VARCHAR(50),
    location_lat FLOAT,
    location_lon FLOAT
);

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

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id),
    date DATE NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL
);
