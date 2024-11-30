# Use an official lightweight Python image as the base
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the application files into the container
COPY . .

# Install the necessary dependencies directly in the Dockerfile
RUN pip install --no-cache-dir flask numpy scikit-learn joblib

# Expose port 5000 for the Flask app
EXPOSE 5000

# Define the command to run the Flask application
CMD ["python", "ServiceModel.py"]
