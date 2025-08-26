import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load API key from backend/.env
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=api_key)

# Initialize model
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_response(prompt, temperature=0.7):
    """
    Generate AI response with a given temperature.
    Default temperature is 0.7 (balanced creativity).
    """
    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": temperature
        }
    )
    return response.text

if __name__ == "__main__":
    # Example prompts with different temperatures
    user_prompt = "Write a short story about a cat who learns to code."

    print("\n--- Low Temperature (0.2) ---")
    print(generate_response(user_prompt, temperature=0.2))

    print("\n--- Medium Temperature (0.7) ---")
    print(generate_response(user_prompt, temperature=0.7))

    print("\n--- High Temperature (0.9) ---")
    print(generate_response(user_prompt, temperature=0.9))
