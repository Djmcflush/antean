CREATE TABLE IF NOT EXISTS aggregate_readiness (
    Personnel_ID VARCHAR(255),
    Readiness_Score_Personnel DECIMAL(5, 2),
    Readiness_Score_Medical DECIMAL(5, 2),
    Readiness_Score_Family DECIMAL(5, 2),
    Overall_Readiness_Score DECIMAL(5, 2),
    FOREIGN KEY (Personnel_ID) REFERENCES personnel_readiness(Personnel_ID)
);
