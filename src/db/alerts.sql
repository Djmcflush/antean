-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id),
    date DATE NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL
);