import json
import psycopg2
from kafka import KafkaConsumer
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def calculate_aggregate_score(personnel_score, family_score, medical_score):
    # Calculate the aggregate readiness score as an average of the three scores
    aggregate_score = (personnel_score + family_score + medical_score) / 3
    return aggregate_score

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
        INSERT INTO aggregate_readiness (
            Personnel_ID, Aggregate_Readiness_Score
        ) VALUES (%s, %s)
        ON CONFLICT (Personnel_ID) DO UPDATE SET
            Aggregate_Readiness_Score = EXCLUDED.Aggregate_Readiness_Score
        """,
        (
            data['Personnel_ID'], data['Aggregate_Readiness_Score']
        )
    )
    connection.commit()
    cursor.close()
    connection.close()

def main():
    # Kafka consumer setup
    consumer = KafkaConsumer(
        'aggregate_readiness',
        bootstrap_servers='localhost:9092',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    for message in consumer:
        # Calculate aggregate readiness score
        personnel_score = message.value['Readiness_Score_Personnel']
        family_score = message.value['Readiness_Score_Family']
        medical_score = message.value['Readiness_Score_Medical']
        aggregate_score = calculate_aggregate_score(personnel_score, family_score, medical_score)

        # Prepare data for database submission
        data = {
            'Personnel_ID': message.value['Personnel_ID'],
            'Aggregate_Readiness_Score': aggregate_score
        }

        # Submit to database
        submit_to_database(data)

if __name__ == "__main__":
    main()
