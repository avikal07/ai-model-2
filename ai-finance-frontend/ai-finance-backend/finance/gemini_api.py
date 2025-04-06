import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API key
GEN_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEN_API_KEY)

def get_financial_recommendations(user_data):
    """
    Generate financial recommendations using Gemini API.
    :param user_data: Dictionary containing financial information.
    :return: AI-generated recommendation string.
    """
    prompt = f"Analyze the following financial data and suggest a plan: {user_data}"
    
    # Create a Gemini model instance
    model = genai.GenerativeModel("gemini-pro")
    
    # Generate the content
    response = model.generate_content(prompt)
    
    # Check if the response has content
    if response and hasattr(response, "text"):
        return response.text
    else:
        return "No recommendations generated."
