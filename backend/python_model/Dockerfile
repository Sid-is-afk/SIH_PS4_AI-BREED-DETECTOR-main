# backend/python_model/Dockerfile

FROM python:3.9-slim
WORKDIR /app

COPY requirements.txt .

# THIS IS THE FIX: Install all missing system dependencies for OpenCV
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

# This line installs your Python packages
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# This line runs your server
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "300", "app:app"]