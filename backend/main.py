from flask import Flask, request, render_template, jsonify, redirect, url_for, session, send_from_directory
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import img_to_array
from PIL import Image
import numpy as np
import os
import google.generativeai as genai
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

app = Flask(__name__, static_folder='../dist', static_url_path='')
app.secret_key = 'AIzaSyASEUOtFmvU-amhrCskFgAk10S7g8cTJFI'  # Change this to a secure secret key
CORS(app)

# Simulated database (replace with actual database in production)
users = {}

# Serve frontend files
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# API routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = users.get(email)
    if user and check_password_hash(user['password'], password):
        session['user_email'] = email
        return jsonify({'message': 'Login successful'})
    
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    
    if not all([email, password, first_name, last_name]):
        return jsonify({'error': 'All fields are required'}), 400
    
    if email in users:
        return jsonify({'error': 'Email already registered'}), 400
    
    # Hash password and store user
    hashed_password = generate_password_hash(password)
    users[email] = {
        'password': hashed_password,
        'first_name': first_name,
        'last_name': last_name
    }
    
    return jsonify({'message': 'Signup successful'})

@app.route('/api/logout')
def logout():
    session.pop('user_email', None)
    return jsonify({'message': 'Logout successful'})

# Protect routes that require authentication
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyASEUOtFmvU-amhrCskFgAk10S7g8cTJFI"
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini model
model_gemini = genai.GenerativeModel('gemini-1.5-pro')

# Create a chat context
chat = model_gemini.start_chat(history=[])

# Define the initial context for the skin care assistant
SYSTEM_PROMPT = """You are DermAssist, an AI skin care assistant. Your responses should be:
1. Brief and to the point
2. Formatted in bullet points or short sections
3. Using clear, simple language
4. Highlighting key terms in *asterisks*

When responding:
• Break information into small, digestible chunks
• Use bullet points for lists
• Limit each response to 3-4 key points
• Bold important terms with *asterisks*
• Avoid long paragraphs
• Include a clear call-to-action when needed

For serious conditions or when professional help is needed:
• End your response with: "🏥 [SUGGEST_APPOINTMENT]"
• This will trigger the appointment booking option

Format your responses like this:
🔍 Key Point 1
• Brief explanation
• Quick tip

💡 Key Point 2
• Brief explanation
• Quick tip

⚠️ Note: [Important warning or disclaimer if needed]

🏥 [SUGGEST_APPOINTMENT] (only include this if professional consultation is recommended)"""

# Load the skin disease prediction model
model = load_model("/Users/lakshiitakalyanasundaram/skin-insight-ai/backend/skin_disease_model.h5")

#Defining the classes
class_names = ["Cellulitis", "Impetigo", "Athelete-Foot", "Nail-Fungus", "Ringworm","Cutaneous-larva-migrans","Chickenpox", "Shingles"]

# Disease information dictionary
disease_info = {
    "Cellulitis": {
        "description": "Cellulitis is a common bacterial skin infection that causes redness, swelling, and pain in the affected area.",
        "causes": "Usually caused by Streptococcus and Staphylococcus bacteria entering through a break in the skin.",
        "prevention": [
            "Keep skin clean and moisturized",
            "Treat cuts and wounds promptly",
            "Wear protective clothing when working outdoors",
            "Manage chronic conditions like diabetes"
        ],
        "treatment": "Treatment typically involves antibiotics, rest, and elevation of the affected area. Severe cases may require hospitalization."
    },
    "Impetigo": {
        "description": "Impetigo is a highly contagious skin infection that mainly affects infants and children, causing red sores that can break open and form a yellow-brown crust.",
        "causes": "Caused by Staphylococcus aureus or Streptococcus pyogenes bacteria.",
        "prevention": [
            "Keep skin clean",
            "Cover cuts and scrapes",
            "Wash hands frequently",
            "Avoid sharing personal items"
        ],
        "treatment": "Treatment includes topical or oral antibiotics, keeping the area clean, and covering the sores to prevent spread."
    },
    "Athelete-Foot": {
        "description": "Athlete's foot is a fungal infection that usually begins between the toes, causing itching, burning, and cracked, blistered skin.",
        "causes": "Caused by various types of fungi that thrive in warm, moist environments.",
        "prevention": [
            "Keep feet clean and dry",
            "Wear breathable shoes",
            "Change socks regularly",
            "Use antifungal powder"
        ],
        "treatment": "Treatment includes antifungal medications, keeping feet dry, and wearing breathable footwear."
    },
    "Nail-Fungus": {
        "description": "Nail fungus is a common condition that begins as a white or yellow spot under the tip of your fingernail or toenail.",
        "causes": "Caused by various fungal organisms, most commonly dermatophytes.",
        "prevention": [
            "Keep nails clean and dry",
            "Wear shoes in public places",
            "Don't share nail tools",
            "Trim nails straight across"
        ],
        "treatment": "Treatment options include oral antifungal medications, topical treatments, and in severe cases, nail removal."
    },
    "Ringworm": {
        "description": "Ringworm is a fungal infection that causes a ring-shaped rash on the skin, which can be itchy and scaly.",
        "causes": "Caused by various types of fungi that live on the skin, surfaces, and household items.",
        "prevention": [
            "Keep skin clean and dry",
            "Don't share personal items",
            "Wear shoes in public places",
            "Wash hands after touching animals"
        ],
        "treatment": "Treatment includes antifungal creams, ointments, or oral medications depending on the severity."
    },
    "Cutaneous-larva-migrans": {
        "description": "Cutaneous larva migrans is a skin infection caused by hookworm larvae that burrow into the skin, causing itchy, red, winding tracks.",
        "causes": "Caused by hookworm larvae from infected animals, usually through contact with contaminated soil.",
        "prevention": [
            "Wear shoes outdoors",
            "Avoid walking barefoot in contaminated areas",
            "Keep pets dewormed",
            "Wash hands after handling soil"
        ],
        "treatment": "Treatment includes antiparasitic medications and topical treatments to relieve itching."
    },
    "Chickenpox": {
        "description": "Chickenpox is a highly contagious viral infection that causes an itchy, blister-like rash and flu-like symptoms.",
        "causes": "Caused by the varicella-zoster virus.",
        "prevention": [
            "Get vaccinated",
            "Avoid contact with infected individuals",
            "Practice good hygiene",
            "Keep infected children home from school"
        ],
        "treatment": "Treatment focuses on relieving symptoms with antihistamines, pain relievers, and keeping the skin clean. Antiviral medications may be prescribed for severe cases."
    },
    "Shingles": {
        "description": "Shingles is a viral infection that causes a painful rash, usually appearing as a single stripe of blisters on one side of the body.",
        "causes": "Caused by the reactivation of the varicella-zoster virus, the same virus that causes chickenpox.",
        "prevention": [
            "Get the shingles vaccine",
            "Maintain a healthy immune system",
            "Manage stress",
            "Get adequate rest"
        ],
        "treatment": "Treatment includes antiviral medications, pain relievers, and topical treatments. Early treatment can help reduce complications."
    }
}

#Preparing the image before feeding it to the model
def preprocess_image(img, target_size):
    img = img.convert("RGB")  # <-- Add this line to ensure 3 channels
    img = img.resize(target_size)
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0
    return img

#Defining the routes
@app.route("/api/analyze", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    try:
        image = Image.open(file.stream)
        image = preprocess_image(image, target_size=(150,150))
        prediction = model.predict(image)
        predicted_class = class_names[np.argmax(prediction)]
        confidence = float(np.max(prediction))
        
        # Get disease information
        disease_data = disease_info.get(predicted_class, {})
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'disease_data': disease_data
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Add system prompt to user message
        full_message = f"{SYSTEM_PROMPT}\n\nUser: {user_message}"
        
        # Generate response using Gemini
        response = chat.send_message(full_message)
        
        # Check if appointment suggestion is needed
        suggest_appointment = "[SUGGEST_APPOINTMENT]" in response.text
        
        # Clean up the response by removing the appointment marker
        cleaned_response = response.text.replace("[SUGGEST_APPOINTMENT]", "")
        
        return jsonify({
            'response': cleaned_response,
            'suggest_appointment': suggest_appointment
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'An error occurred while processing your request'
        }), 500

if __name__ == "__main__":
    app.run(debug=True)