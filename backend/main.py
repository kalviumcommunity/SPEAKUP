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

# Multi-shot examples
examples = [
    {
        "input": "Translate 'Good morning' into Spanish.",
        "output": "Buenos días"
    },
    {
        "input": "Translate 'How are you?' into Spanish.",
        "output": "¿Cómo estás?"
    },
    {
        "input": "Translate 'Thank you' into Spanish.",
        "output": "Gracias"
    }
]

# Build the multi-shot prompt
multi_shot_prompt = "You are a helpful translation assistant. Translate English to Spanish.\n\n"
for ex in examples:
    multi_shot_prompt += f"English: {ex['input']}\nSpanish: {ex['output']}\n\n"

# Add the final query (real test)
multi_shot_prompt += "English: Translate 'I love programming' into Spanish.\nSpanish:"

# Get response
response = model.generate_content(multi_shot_prompt)

# Print output
print("Multi-Shot Prompt Output:\n", response.text)
