CREATE TABLE IF NOT EXISTS  family_readiness (
    Personnel_ID VARCHAR(255),
    Family_Status VARCHAR(255),
    Dependent_Count INT,
    Primary_Emergency_Contact VARCHAR(255),
    Emergency_Contact_Phone VARCHAR(20),
    Family_Support_Plan BOOLEAN,
    Family_Support_Plan_Update_Date DATE,
    Dependent_Care_Status VARCHAR(255),
    Housing_Status VARCHAR(255),
    Spouse_Employment_Status VARCHAR(255),
    Readiness_Score_Family DECIMAL(5, 2),
    FOREIGN KEY (Personnel_ID) REFERENCES personnel_readiness(Personnel_ID)
);