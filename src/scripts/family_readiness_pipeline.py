import json
import psycopg2
from kafka import KafkaConsumer
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def process_data(data):
    # Process data to calculate readiness score
    if data['Family_Support_Plan'] and data['Housing_Status'] == 'Stable':
        data['Readiness_Score_Family'] = 100.0
    else:
        data['Readiness_Score_Family'] = 50.0
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
        INSERT INTO family_readiness (
            Personnel_ID, Family_Status, Dependent_Count, Primary_Emergency_Contact,
            Emergency_Contact_Phone, Family_Support_Plan, Family_Support_Plan_Update_Date,
            Dependent_Care_Status, Housing_Status, Spouse_Employment_Status, Readiness_Score_Family
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (Personnel_ID) DO UPDATE SET
            Family_Status = EXCLUDED.Family_Status,
            Dependent_Count = EXCLUDED.Dependent_Count,
            Primary_Emergency_Contact = EXCLUDED.Primary_Emergency_Contact,
            Emergency_Contact_Phone = EXCLUDED.Emergency_Contact_Phone,
            Family_Support_Plan = EXCLUDED.Family_Support_Plan,
            Family_Support_Plan_Update_Date = EXCLUDED.Family_Support_Plan_Update_Date,
            Dependent_Care_Status = EXCLUDED.Dependent_Care_Status,
            Housing_Status = EXCLUDED.Housing_Status,
            Spouse_Employment_Status = EXCLUDED.Spouse_Employment_Status,
            Readiness_Score_Family = EXCLUDED.Readiness_Score_Family
        """,
        (
            data['Personnel_ID'], data['Family_Status'], data['Dependent_Count'], data['Primary_Emergency_Contact'],
            data['Emergency_Contact_Phone'], data['Family_Support_Plan'], data['Family_Support_Plan_Update_Date'],
            data['Dependent_Care_Status'], data['Housing_Status'], data['Spouse_Employment_Status'],
            data['Readiness_Score_Family']
        )
    )
    connection.commit()
    cursor.close()
    connection.close()

def main():
    # Kafka consumer setup
    consumer = KafkaConsumer(
        'family_readiness',
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
