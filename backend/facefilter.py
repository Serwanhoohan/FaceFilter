from flask import Flask, render_template, Response, jsonify
import cv2
import face_recognition
import numpy as np
import os

app = Flask(__name__)

# -------------------------
# Load known faces
# -------------------------
known_encodings = []
known_names = []

KNOWN_DIR = "known_faces"

for file in os.listdir(KNOWN_DIR):
    path = os.path.join(KNOWN_DIR, file)
    image = face_recognition.load_image_file(path)

    enc = face_recognition.face_encodings(image)
    if len(enc) == 0:
        continue

    known_encodings.append(enc[0])
    known_names.append(os.path.splitext(file)[0])

# -------------------------
# Webcam
# -------------------------
camera = cv2.VideoCapture(0)

current_name = "No face"

def process_frame():
    global current_name

    success, frame = camera.read()
    if not success:
        return None

    rgb = frame[:, :, ::-1]

    face_locations = face_recognition.face_locations(rgb)
    face_encodings = face_recognition.face_encodings(rgb, face_locations)

    for encoding in face_encodings:
        matches = face_recognition.compare_faces(known_encodings, encoding)
        name = "Unknown"

        distances = face_recognition.face_distance(known_encodings, encoding)

        if len(distances) > 0:
            best = np.argmin(distances)
            if matches[best]:
                name = known_names[best]

        current_name = name

    # Encode frame to display in browser
    _, buffer = cv2.imencode(".jpg", frame)
    return buffer.tobytes()

def generate():
    while True:
        frame = process_frame()
        if frame is None:
            continue

        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")

@app.route("/")
def index():
    return render_template("facefilter.html")

@app.route("/video")
def video():
    return Response(generate(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/name")
def name():
    return jsonify({"name": current_name})

if __name__ == "__main__":
    app.run(debug=True)
