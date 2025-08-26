import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")  # or gemini-1.5-pro


def generate_debate_one_shot(topic: str, style: str = "structured"):
    """Generate structured debate arguments (One-shot prompting)"""

    prompt = f"""
    You are a debate moderator.

    ## Example Debate (One-Shot Example)
    Topic: "Should students wear uniforms?"
    Debate Style: formal
    Output (JSON):
    {{
        "topic": "Should students wear uniforms?",
        "pro": [
            "Promotes equality among students",
            "Reduces distractions and peer pressure"
        ],
        "con": [
            "Limits self-expression",
            "May cause discomfort for some students"
        ]
    }}

    ## Now Generate New Debate
    Topic: {topic}
    Debate Style: {style}
    Output strictly in JSON format:
    {{
        "topic": "{topic}",
        "pro": ["argument 1", "argument 2"],
        "con": ["argument 1", "argument 2"]
    }}
    """

    response = model.generate_content(prompt)
    return response.text


if __name__ == "__main__":
    import sys

    # Allow command-line input
    if len(sys.argv) > 1:
        topic = sys.argv[1]
    else:
        topic = "Should AI replace teachers?"

    style = "formal"
    output = generate_debate_one_shot(topic, style)

    print("=== Debate Output (One-Shot) ===")
    print(output)
    print("===============================")
