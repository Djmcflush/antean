CREATE TABLE IF NOT EXISTS  personnel_readiness (
    Personnel_ID VARCHAR(255) PRIMARY KEY,
    Branch VARCHAR(255),
    Rank VARCHAR(255),
    First_Name VARCHAR(255),
    Last_Name VARCHAR(255),
    Date_of_Birth DATE,
    Sex VARCHAR(50),
    MOS VARCHAR(255),
    Unit VARCHAR(255),
    Date_of_Enlistment DATE,
    Years_of_Service INT,
    Deployment_Status VARCHAR(255),
    Deployment_Location VARCHAR(255),
    Training_Status VARCHAR(255),
    Next_Training_Date DATE,
    Security_Clearance VARCHAR(255),
    Readiness_Score_Personnel DECIMAL(5, 2)
);