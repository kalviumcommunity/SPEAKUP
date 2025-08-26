import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load API key from backend/.env
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)

# Create model instance
model = genai.GenerativeModel("gemini-1.5-flash")

# -------- Dynamic Prompting Example --------
# Let's say we want to build a personalized travel recommendation system.
# The prompt changes dynamically based on user inputs.

def generate_dynamic_prompt(user_name, interests, budget, location):
    return f"""
    You are an AI travel assistant.

    User Details:
    - Name: {user_name}
    - Interests: {", ".join(interests)}
    - Budget: {budget}
    - Current Location: {location}

    Task:
    Suggest 3 personalized travel destinations with short explanations 
    that match the user's interests and budget.
    """

# Example: dynamic user input (could also come from API, DB, or CLI input)
user_name = "Nidhi"
interests = ["beaches", "history", "food"]
budget = "₹50,000"
location = "India"

# Build prompt dynamically
dynamic_prompt = generate_dynamic_prompt(user_name, interests, budget, location)

# Get AI response
response = model.generate_content(dynamic_prompt)

# Print Output
print("Dynamic Prompt Output:\n", response.text)
