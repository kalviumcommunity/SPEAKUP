import os
from dotenv import load_dotenv
import google.generativeai as genai
import datetime

# Load API key
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=api_key)

# Example function to get weather (dummy response)
def get_weather(city: str):
    weather_data = {
        "Delhi": "Sunny, 35°C",
        "Mumbai": "Rainy, 28°C",
        "Bangalore": "Cloudy, 26°C"
    }
    return weather_data.get(city, "Weather data not available")

# Example function to get current time
def get_time():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Register functions with Gemini
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "Name of the city"}
            },
            "required": ["city"]
        },
    },
    {
        "name": "get_time",
        "description": "Get the current date and time",
        "parameters": {"type": "object", "properties": {}},
    }
]

# Create model with tools
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    tools=tools
)

def chat_with_ai(user_input):
    # Send user input
    response = model.generate_content(user_input)

    # Check if function call is required
    if response.candidates[0].content.parts[0].function_call:
        fn_call = response.candidates[0].content.parts[0].function_call
        fn_name = fn_call.name
        args = fn_call.args

        if fn_name == "get_weather":
            city = args.get("city")
            result = get_weather(city)
        elif fn_name == "get_time":
            result = get_time()
        else:
            result = "Unknown function"

        # Send result back to the model for a final response
        final_response = model.generate_content(
            f"The result of {fn_name} is: {result}"
        )
        return final_response.text

    return response.text


if __name__ == "__main__":
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        print("AI:", chat_with_ai(user_input))
