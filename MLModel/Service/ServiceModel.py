from flask import Flask, request, jsonify
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load the pre-trained models
gradient_boosting_model = joblib.load("gradient_boosting_model.pkl")
random_forest_model = joblib.load("random_forest_model.pkl")

# Define the expected features
features = ['Sex', 'Age', 'Injury', 'Mental', 'NRS_pain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']

def preprocess_input(data):
    """
    Preprocess input data to match the model's expected format.
    """
    try:
        # Extract feature values in the correct order
        input_data = [data.get(feature, None) for feature in features]
        
        if None in input_data:
            missing_features = [features[i] for i, val in enumerate(input_data) if val is None]
            return None, f"Missing features: {', '.join(missing_features)}"

        # Convert to numpy array and reshape for prediction
        return np.array(input_data).reshape(1, -1), None

    except Exception as e:
        return None, str(e)

@app.route('/predict/gradient_boosting', methods=['POST'])
def predict_gradient_boosting():
    """
    API endpoint for predictions using the Gradient Boosting model.
    """
    input_data, error = preprocess_input(request.json)
    if error:
        return jsonify({"error": error}), 400

    prediction = gradient_boosting_model.predict(input_data)
    return jsonify({"prediction": prediction.tolist()})

@app.route('/predict/random_forest', methods=['POST'])
def predict_random_forest():
    """
    API endpoint for predictions using the Random Forest model.
    """
    input_data, error = preprocess_input(request.json)
    if error:
        return jsonify({"error": error}), 400

    prediction = random_forest_model.predict(input_data)
    return jsonify({"prediction": prediction.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
