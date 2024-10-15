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
