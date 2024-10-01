import os
import torch
from flask import Flask, request, jsonify
from torchvision import models, transforms
from PIL import Image
import io
import json

# Initialize the Flask app
app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
recipe_file_path = os.path.join(BASE_DIR, 'recipes.json')

with open(recipe_file_path, 'r') as f:
    FOOD_TO_RECIPE = json.load(f)

# Load a pre-trained model (ResNet in this case)
model = models.resnet50(pretrained=True)
model.eval()

# Define transformation for image preprocessing
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

    # Mock logic: Consider image as food only if confidence is above a threshold (e.g., 0.5)
    if confidence.item() < 0.5:
        return None  # Not confident enough that the image is food

    # Mock mapping: Use predicted class to select a food category
    food_categories = list(FOOD_TO_RECIPE.keys())
    category = food_categories[predicted.item() % len(food_categories)]  # Mock category

    return category

# Route for recipe prediction
@app.route('/predict-recipe', methods=['POST'])
def predict_recipe():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image'].read()

    try:
        # Predict if the image is food and get the food category
        food_category = predict_food(image)

        if food_category is None:
            return jsonify({'error': 'The uploaded image is not a recognized food item'}), 400

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
