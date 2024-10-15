CREATE TABLE IF NOT EXISTS  medical_readiness (
    Personnel_ID VARCHAR(255),
    Medical_Exam_Status VARCHAR(255),
    Last_Physical_Exam_Date DATE,
    Next_Physical_Exam_Due DATE,
    Dental_Exam_Status VARCHAR(255),
    Immunizations_Up_to_Date BOOLEAN,
    Medical_Waiver_Status VARCHAR(255),
    Injury_Status VARCHAR(255),
    Mental_Health_Status VARCHAR(255),
    Deployment_Health_Clearance VARCHAR(255),
    Medical_Profile_Code VARCHAR(255),
    Sick_Days_Last_6_Months INT,
    Readiness_Score_Medical DECIMAL(5, 2),
    FOREIGN KEY (Personnel_ID) REFERENCES personnel_readiness(Personnel_ID)
);