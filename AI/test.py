import os
import torch 
from flask import Flask, request, jsonify
from torchvision import transforms, models
from PIL import Image
import io
import json
from torch import nn
from flask_cors import CORS
# Initialize the Flask app

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Path to your trained model and recipe JSON file
MODEL_PATH = r'D:\Others\TOPUP\Test Projects\Recipe-System-with-Mern-Stack\AI\food_resnet50_colab.pth'  # Update with your trained model path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECIPE_FILE_PATH = os.path.join(BASE_DIR, 'food.json')

# Load the recipe dataset
with open(RECIPE_FILE_PATH, 'r') as f:
    FOOD_TO_RECIPE = json.load(f)

# Load the trained model
model = models.resnet50()
num_classes = 100  # Ensure this matches your number of classes
model.fc = nn.Linear(model.fc.in_features, num_classes) 

# Load the model weights (use map_location for CPU)
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()
print("Model loaded successfully and is ready for inference.")

# Define the image preprocessing transformations
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Function to predict the food category from an image
def predict_food(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))

    # Convert image to RGB if it's not already
    if image.mode != 'RGB':
        image = image.convert('RGB')

    img_tensor = preprocess(image).unsqueeze(0)  # Preprocess the image

    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = probabilities.max(1)
    
    print(f"Predicted class: {predicted.item()}, Confidence: {confidence.item()}")

    # Return the predicted class index and confidence score
    return predicted.item(), confidence.item()

# Route for recipe prediction
@app.route('/predict-recipe', methods=['POST'])
def predict_recipe():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image'].read()

    try:
        # Predict the food category and confidence
        predicted_class, confidence = predict_food(image)
        print(f"Predicted class index: {predicted_class}, Confidence: {confidence}")

        if confidence < 0.7:  # Confidence threshold
            return jsonify({'error': 'The uploaded image is not a recognized food item'}), 400

        # Get the corresponding food category from the UEC-Food100 dataset
        food_categories = list(FOOD_TO_RECIPE.keys())
        food_category = food_categories[predicted_class-1]  # Make sure no -1 if zero-indexed
        print(f"Predicted food category: {food_category}")

        # Retrieve the corresponding recipe
        recipe = FOOD_TO_RECIPE.get(food_category)

        if recipe:
            return jsonify(recipe), 200
        else:
            return jsonify({'error': 'Recipe not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
