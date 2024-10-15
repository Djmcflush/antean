import psycopg2
from psycopg2 import sql
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def add_readiness_prediction(unit_id, unit_name, start_date, end_date, readiness_score):
    # Connect to the database
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    
    try:
        with conn.cursor() as cur:
            # Insert the new prediction
            insert_query = sql.SQL("""
                INSERT INTO readiness_predictions 
                (unit_id, unit_name, start_date, end_date, readiness_score)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """)
            cur.execute(insert_query, (unit_id, unit_name, start_date, end_date, readiness_score))
            
            # Fetch the id of the newly inserted row
            new_id = cur.fetchone()[0]
            
            # Commit the transaction
            conn.commit()
            
            print(f"Successfully added readiness prediction with id {new_id}")
            return new_id
    except Exception as e:
        # If an error occurs, rollback the transaction
        conn.rollback()
        print(f"An error occurred: {e}")
        return None
    finally:
        # Always close the connection
        conn.close()

# Example usage
if __name__ == "__main__":
    add_readiness_prediction(
        unit_id="A123",
        unit_name="Alpha Company",
        start_date=datetime(2024, 1, 1),
        end_date=datetime(2024, 1, 15),
        readiness_score=75
    )
