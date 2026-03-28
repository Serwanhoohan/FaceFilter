const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("SecureFace SOC backend is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
// SOC Risk Scoring System
function calculateRisk(event) {
  let riskScore = 0;

  if (event.failedAttempts >= 3) {
    riskScore += 30;
  }

  if (event.newDevice) {
    riskScore += 20;
  }

  if (event.unusualTime) {
    riskScore += 10;
  }

  if (event.suspiciousIP) {
    riskScore += 25;
  }

  return riskScore;
}

// Example login route
app.post("/login", (req, res) => {
  const event = req.body;

  const risk = calculateRisk(event);

  if (risk >= 60) {
    return res.json({ status: "BLOCKED", risk });
  } else if (risk >= 30) {
    return res.json({ status: "SUSPICIOUS", risk });
  } else {
    return res.json({ status: "ALLOWED", risk });
  }
});

import cv2

# Load OpenCV's built-in face detector
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# Open webcam (0 = default laptop camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Cannot open webcam")
    exit()

while True:
    # Read frame from camera
    ret, frame = cap.read()
    if not ret:
        break

    # Convert to grayscale (required for detection)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Draw rectangles around faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, "Face", (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Show live video
    cv2.imshow("Real-Time Face Scanner", frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
