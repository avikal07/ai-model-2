from google.cloud import aiplatform

# Configure Vertex AI
def configure_vertex():
    aiplatform.init(
        project="your-google-cloud-project-id",
        location="us-central1",
    )

# Function to get predictions from Vertex AI
def get_vertex_predictions(endpoint_name, input_data):
    configure_vertex()
    endpoint = aiplatform.Endpoint(endpoint_name=endpoint_name)
    response = endpoint.predict([input_data])
    return response
