import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import GenerationConfig

# Load API key from backend/.env
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GEMINI_API_KEY")

# Configure the Gemini client
genai.configure(api_key=api_key)

# Define a schema for structured output
schema = {
    "type": "object",
    "properties": {
        "university_name": {"type": "string"},
        "location": {"type": "string"},
        "courses_offered": {"type": "array", "items": {"type": "string"}},
        "eligibility": {"type": "string"},
        "ranking": {"type": "integer"}
    },
    "required": ["university_name", "location", "courses_offered", "eligibility", "ranking"]
}

# Create the model with structured output
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=GenerationConfig(
        response_mime_type="application/json",
        response_schema=schema
    )
)

# Example input
prompt = """
Suggest a good university in India for Computer Science undergraduate program.
Provide structured details.
"""

# Generate structured output
response = model.generate_content(prompt)

# Print raw JSON response
print("\nStructured JSON Output:")
print(response.text)
