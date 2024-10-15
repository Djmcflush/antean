import subprocess
import logging

def start_pipeline(script_name):
    try:
        subprocess.run(['python', script_name], check=True)
    except subprocess.CalledProcessError as e:
        logging.error(f"Error running {script_name}: {e}")
        # Handle rehydration or other error recovery here

def main():
    logging.basicConfig(level=logging.INFO)
    pipelines = [
        'personnel_readiness_pipeline.py',
        'family_readiness_pipeline.py',
        'medical_readiness_pipeline.py',
        'aggregate_readiness_pipeline.py'
    ]

    for pipeline in pipelines:
        logging.info(f"Starting {pipeline}")
        start_pipeline(pipeline)

if __name__ == "__main__":
    main()
