import random
from datetime import datetime, timedelta
from add_readiness_predictions import add_readiness_prediction

def generate_mock_prediction():
    """Generate a mock readiness prediction"""
    units = ["Alpha Company", "Bravo Company", "Charlie Company", "Delta Company"]
    unit_name = random.choice(units)
    unit_id = f"{unit_name[0]}{''.join(random.choices('0123456789', k=3))}"
    start_date = datetime.now() + timedelta(days=random.randint(1, 30))
    end_date = start_date + timedelta(days=random.randint(7, 60))
    readiness_score = random.randint(50, 100)
    
    return unit_id, unit_name, start_date, end_date, readiness_score

def run_prediction_pipeline(num_predictions=5):
    """Run the prediction pipeline"""
    print(f"Running prediction pipeline to generate {num_predictions} predictions...")
    
    for _ in range(num_predictions):
        prediction = generate_mock_prediction()
        result = add_readiness_prediction(*prediction)
        
        if result:
            print(f"Added prediction for {prediction[1]} (ID: {prediction[0]})")
        else:
            print(f"Failed to add prediction for {prediction[1]} (ID: {prediction[0]})")
    
    print("Prediction pipeline completed.")

if __name__ == "__main__":
    run_prediction_pipeline()
