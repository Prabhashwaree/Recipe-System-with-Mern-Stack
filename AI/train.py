import torch
from torch import nn, optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import os

# Check if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Paths to dataset (update these paths to match your dataset location)
train_data_dir = r'D:\Others\TOPUP\Test Projects\Recipe-System-with-Mern-Stack\AI\dataset\train'
val_data_dir = r'D:\Others\TOPUP\Test Projects\Recipe-System-with-Mern-Stack\AI\dataset\train'

# Number of food categories (UEC-Food100 has 100 classes)
num_classes = 100

# Define transformations for training and validation sets
train_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load the dataset
train_dataset = datasets.ImageFolder(root=train_data_dir, transform=train_transforms)
val_dataset = datasets.ImageFolder(root=val_data_dir, transform=val_transforms)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Load pre-trained ResNet-50 model
model = models.resnet50(pretrained=True)

# Freeze all layers except the last fully connected layer
for param in model.parameters():
    param.requires_grad = False

# Replace the fully connected layer to classify 100 classes (for UEC-Food100)
model.fc = nn.Linear(model.fc.in_features, num_classes)

# Move the model to GPU if available
model = model.to(device)

# Define loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=0.001)

# Training loop
epochs = 1  # Number of epochs

for epoch in range(epochs):
    model.train()  # Set model to training mode
    running_loss = 0.0

    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)

        # Zero the parameter gradients
        optimizer.zero_grad()

        # Forward pass
        outputs = model(inputs)
        loss = criterion(outputs, labels)

        # Backward pass and optimize
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Epoch [{epoch+1}/{epochs}], Loss: {running_loss / len(train_loader)}")

    # Validation step
    # model.eval()  # Set model to evaluation mode
    # val_loss = 0.0
    # correct = 0
    # total = 0

    # with torch.no_grad():
    #     for inputs, labels in val_loader:
    #         inputs, labels = inputs.to(device), labels.to(device)

    #         outputs = model(inputs)
    #         loss = criterion(outputs, labels)

    #         val_loss += loss.item()
    #         _, predicted = torch.max(outputs, 1)
    #         total += labels.size(0)
    #         correct += (predicted == labels).sum().item()

    # print(f"Validation Loss: {val_loss / len(val_loader)}, Accuracy: {100 * correct / total:.2f}%")

# Save the trained model
model_save_path = 'food_resnet50.pth'
torch.save(model.state_dict(), model_save_path)
print(f"Model saved to {model_save_path}")
