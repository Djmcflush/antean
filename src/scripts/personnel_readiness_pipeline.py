import json
import psycopg2
from kafka import KafkaConsumer
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def process_data(data):
    # Process data to calculate readiness score
    if data['Training_Status'] == 'Complete' and data['Deployment_Status'] == 'Active':
        data['Readiness_Score_Personnel'] = 100.0
    else:
        data['Readiness_Score_Personnel'] = 50.0
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
        INSERT INTO personnel_readiness (
            Personnel_ID, Branch, Rank, First_Name, Last_Name, Date_of_Birth, Sex, MOS, Unit,
            Date_of_Enlistment, Years_of_Service, Deployment_Status, Deployment_Location,
            Training_Status, Next_Training_Date, Security_Clearance, Readiness_Score_Personnel
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (Personnel_ID) DO UPDATE SET
            Branch = EXCLUDED.Branch,
            Rank = EXCLUDED.Rank,
            First_Name = EXCLUDED.First_Name,
            Last_Name = EXCLUDED.Last_Name,
            Date_of_Birth = EXCLUDED.Date_of_Birth,
            Sex = EXCLUDED.Sex,
            MOS = EXCLUDED.MOS,
            Unit = EXCLUDED.Unit,
            Date_of_Enlistment = EXCLUDED.Date_of_Enlistment,
            Years_of_Service = EXCLUDED.Years_of_Service,
            Deployment_Status = EXCLUDED.Deployment_Status,
            Deployment_Location = EXCLUDED.Deployment_Location,
            Training_Status = EXCLUDED.Training_Status,
            Next_Training_Date = EXCLUDED.Next_Training_Date,
            Security_Clearance = EXCLUDED.Security_Clearance,
            Readiness_Score_Personnel = EXCLUDED.Readiness_Score_Personnel
        """,
        (
            data['Personnel_ID'], data['Branch'], data['Rank'], data['First_Name'], data['Last_Name'],
            data['Date_of_Birth'], data['Sex'], data['MOS'], data['Unit'], data['Date_of_Enlistment'],
            data['Years_of_Service'], data['Deployment_Status'], data['Deployment_Location'],
            data['Training_Status'], data['Next_Training_Date'], data['Security_Clearance'],
            data['Readiness_Score_Personnel']
        )
    )
    connection.commit()
    cursor.close()
    connection.close()

def main():
    # Kafka consumer setup
    consumer = KafkaConsumer(
        'personnel_readiness',
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
