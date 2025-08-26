import os
from dotenv import load_dotenv
import google.generativeai as genai


# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")  # ✅ or gemini-1.5-pro

def generate_debate(topic: str, style: str = "structured"):
    """Generate structured debate arguments (Zero-shot)"""
    prompt = f"""
    You are a debate moderator.
    Topic: {topic}
    Debate Style: {style}

    
    Generate structured arguments with Pro and Con sides.
    Return output strictly in JSON format:
    {{
        "topic": "{topic}",
        "pro": ["argument 1", "argument 2"],
        "con": ["argument 1", "argument 2"]
    }}
    """

    response = model.generate_content(prompt)
    return response.text


if __name__ == "__main__":
    topic = "Should AI replace teachers?"
    style = "formal"
    output = generate_debate(topic, style)
    print("=== Debate Output ===")
    print(output)
    print("====================")
