from google.cloud import aiplatform
from google.auth.exceptions import DefaultCredentialsError
import os

# Configure Vertex AI
def configure_vertex():
    try:
        aiplatform.init(
            project=os.getenv("GCP_PROJECT_ID", "your-google-cloud-project-id"),
            location=os.getenv("GCP_REGION", "us-central1"),
        )
    except DefaultCredentialsError as e:
        print("Vertex AI authentication failed. Check credentials.")
        raise e

# Function to get predictions from Vertex AI
def get_vertex_predictions(endpoint_name, input_data):
    try:
        configure_vertex()
        endpoint = aiplatform.Endpoint(endpoint_name=endpoint_name)
        response = endpoint.predict(instances=[input_data])
        return response.predictions  # return only predictions
    except Exception as e:
        print(f"Error while calling Vertex AI: {str(e)}")
        raise e
