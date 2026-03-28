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
