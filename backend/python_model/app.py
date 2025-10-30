# In file: backend/python_model/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io
import traceback # Import for detailed error logging

app = Flask(__name__)
CORS(app) 

try:
    model = YOLO('best.pt')
    print("✅ YOLOv8 model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading YOLOv8 model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not available or failed to load'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    try:
        image_bytes = file.read()
        
        # Add a check for empty files
        if not image_bytes:
            return jsonify({'error': 'The uploaded file is empty'}), 400
            
        image = Image.open(io.BytesIO(image_bytes))
        
        # Run prediction
        results = model(image)
        
        detections = []
        if results and len(results) > 0:
            result = results[0]
            class_names = result.names
            for box in result.boxes:
                class_id = int(box.cls[0])
                detections.append({
                    'breed': class_names[class_id],
                    'confidence': float(box.conf[0]),
                    'bounding_box': box.xyxy[0].tolist()
                })
        
        if not detections:
            print("⚠️ No valid detections found in the image.")
        else:
            print(f"✅ Found {len(detections)} detections.")

        # Always return a JSON array, even if it's empty
        return jsonify(detections)

    except Exception as e:
        # This will now print the full, detailed error to your logs
        print("❌ An unexpected error occurred during prediction:")
        traceback.print_exc()
        return jsonify({'error': 'A server error occurred while processing the image.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)