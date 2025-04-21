# Use Python 3.9 as base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies and verify installation
RUN pip install --no-cache-dir -r requirements.txt && \
    pip list | grep flask-cors && \
    pip list | grep Flask

# Copy the rest of the application
COPY . .

# Expose port 5000 for Flask
EXPOSE 5000

# Command to run the application
CMD ["python", "main.py"]

