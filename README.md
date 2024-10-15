# Military Unit Readiness Prediction System

This project is designed to calculate and track the readiness of military units from the squad level up to the field army level. It aggregates unit-level data, such as personnel, equipment, training, and logistics readiness, to generate an overall readiness score at each hierarchy level (platoon, company, battalion, brigade, etc.). The system will predict readiness trends and provide valuable insights for command decisions.

## Project Goals

- **Track readiness**: Calculate readiness scores based on multiple factors like personnel, equipment, training, and supplies.
- **Predict readiness**: Use a pipeline to generate predictions on future readiness trends based on historical data and conditions.
- **Aggregate readiness**: Roll up the readiness data from the squad level to higher levels of the military hierarchy, making it possible to view readiness scores for platoons, companies, battalions, brigades, divisions, corps, and armies.

## Features

- **Readiness Score Calculation**: Track readiness metrics across units, including personnel availability, equipment status, training completion, and logistical supplies.
- **Prediction Pipeline**: Predict future readiness scores based on historical trends.
- **Database Integration**: Store readiness data and predictions in a database for easy querying and reporting.

## Project Structure

```
├── src/
│   ├── scripts/
│   │   ├── readiness_prediction_pipeline.py
│   │   ├── add_readiness_predictions.py
│   └── setupDatabase.js
├── README.md
└── requirements.txt
```

- **setupDatabase.js**: Initializes the database, creates necessary tables, and populates it with sample data.
- **readiness_prediction_pipeline.py**: Generates mock readiness predictions and integrates them into the database.
- **add_readiness_predictions.py**: Script to add generated predictions to the database.

## Database Setup and Prediction Pipeline

### Setting up the Database

To set up the database, run the following command:

```bash
node setupDatabase.js
```

This script will create the necessary tables and insert sample data into the database.

### Running the Prediction Pipeline

To generate and add readiness predictions to the database, run the following command:

```bash
python src/scripts/readiness_prediction_pipeline.py
```

This script will generate mock predictions and add them to the database using the `add_readiness_predictions.py` script.

## Requirements

Make sure to have the following dependencies installed before running the project:

- **Node.js** (for database setup)
- **Python 3.x** (for running the prediction pipeline)
- Required Python packages (listed in `requirements.txt`)

To install the necessary Python dependencies, run:

```bash
pip install -r requirements.txt
```

## Future Enhancements

- **Integration with real data**: Use actual military unit readiness data for more accurate predictions.
- **Improved prediction algorithms**: Implement machine learning models to enhance the prediction of future readiness scores.
- **Dashboard for visualization**: Add a web-based interface to visualize readiness metrics and trends at various levels of the hierarchy.
