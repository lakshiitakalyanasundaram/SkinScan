from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyASEUOtFmvU-amhrCskFgAk10S7g8cTJFI"
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel('gemini-1.5-pro')

# Create a chat context
chat = model.start_chat(history=[])

# Define the initial context for the skin care assistant
SYSTEM_PROMPT = """You are DermAssist, an AI skin care assistant. Your role is to:
1. Help users understand their skin concerns
2. Provide general skin care advice
3. Suggest when users should seek professional medical help
4. Answer questions about common skin conditions
5. Provide basic skin care recommendations

Remember to:
- Always clarify you're an AI and not a medical professional
- Recommend consulting a dermatologist for serious concerns
- Be empathetic and professional
- Focus on evidence-based information
- Avoid making definitive diagnoses
"""

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Generate response using Gemini
        response = chat.send_message(user_message)
        
        return jsonify({
            'response': response.text
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'An error occurred while processing your request'
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 