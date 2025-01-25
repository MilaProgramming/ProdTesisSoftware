from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Load the saved model
with open('modelo_arbol.pkl', 'rb') as file:
    model = pickle.load(file)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define endpoint for predicting urgency
@app.route('/obtenerUrgencia', methods=['POST'])
def predict():
    try:
        # Parse input JSON data
        data = request.json
        # Expected input format: {"dolor_cabeza": int, "temperatura": int, "dolor_estómago": int, "malestar_general": int, "dolor_garganta": int, "herida": int}
        features = [
            data.get("dolor_cabeza", 0),
            data.get("temperatura", 0),
            data.get("dolor_estómago", 0),
            data.get("malestar_general", 0),
            data.get("dolor_garganta", 0),
            data.get("herida", 0),
        ]
        
        # Reshape the input for prediction
        prediction = model.predict([features])[0]
        
        # Return prediction result
        return jsonify({"nivel_urgencia": int(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
