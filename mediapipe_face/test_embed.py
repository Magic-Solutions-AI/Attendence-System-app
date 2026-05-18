import app
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
import numpy as np

# Create a dummy landmark list
class DummyLandmark:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

# MediaPipe face landmarks is exactly 478 points usually
landmarks = [DummyLandmark(0.1, 0.2, 0.3) for _ in range(478)]

try:
    embedding = app.extract_face_geometry(landmarks, 1280, 720)
    print("Embedding calculated successfully, length:", len(embedding))
except Exception as e:
    print("Error calculating embedding:", e)
