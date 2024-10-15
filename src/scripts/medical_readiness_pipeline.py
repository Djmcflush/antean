import json
import psycopg2
from kafka import KafkaConsumer
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def process_data(data):
    # Process data to calculate readiness score
    if data['Medical_Exam_Status'] == 'Complete' and data['Immunizations_Up_to_Date']:
        data['Readiness_Score_Medical'] = 100.0
    else:
        data['Readiness_Score_Medical'] = 50.0
    return data

def submit_to_database(data):
    # Connect to the PostgreSQL database using environment variables
    connection = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = connection.cursor()
    cursor.execute(
        """
        INSERT INTO medical_readiness (
            Personnel_ID, Medical_Exam_Status, Last_Physical_Exam_Date, Next_Physical_Exam_Due,
            Dental_Exam_Status, Immunizations_Up_to_Date, Medical_Waiver_Status, Injury_Status,
            Mental_Health_Status, Deployment_Health_Clearance, Medical_Profile_Code,
            Sick_Days_Last_6_Months, Readiness_Score_Medical
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (Personnel_ID) DO UPDATE SET
            Medical_Exam_Status = EXCLUDED.Medical_Exam_Status,
            Last_Physical_Exam_Date = EXCLUDED.Last_Physical_Exam_Date,
            Next_Physical_Exam_Due = EXCLUDED.Next_Physical_Exam_Due,
            Dental_Exam_Status = EXCLUDED.Dental_Exam_Status,
            Immunizations_Up_to_Date = EXCLUDED.Immunizations_Up_to_Date,
            Medical_Waiver_Status = EXCLUDED.Medical_Waiver_Status,
            Injury_Status = EXCLUDED.Injury_Status,
            Mental_Health_Status = EXCLUDED.Mental_Health_Status,
            Deployment_Health_Clearance = EXCLUDED.Deployment_Health_Clearance,
            Medical_Profile_Code = EXCLUDED.Medical_Profile_Code,
            Sick_Days_Last_6_Months = EXCLUDED.Sick_Days_Last_6_Months,
            Readiness_Score_Medical = EXCLUDED.Readiness_Score_Medical
        """,
        (
            data['Personnel_ID'], data['Medical_Exam_Status'], data['Last_Physical_Exam_Date'],
            data['Next_Physical_Exam_Due'], data['Dental_Exam_Status'], data['Immunizations_Up_to_Date'],
            data['Medical_Waiver_Status'], data['Injury_Status'], data['Mental_Health_Status'],
            data['Deployment_Health_Clearance'], data['Medical_Profile_Code'], data['Sick_Days_Last_6_Months'],
            data['Readiness_Score_Medical']
        )
    )
    connection.commit()
    cursor.close()
    connection.close()

def main():
    # Kafka consumer setup
    consumer = KafkaConsumer(
        'medical_readiness',
        bootstrap_servers='localhost:9092',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    for message in consumer:
        # Data processing
        processed_data = process_data(message.value)

        # Submit to database
        submit_to_database(processed_data)

if __name__ == "__main__":
    main()
