const express = require("express");
const app = express();

app.use(express.json());

// Store login events (for demo)
let loginEvents = [];

// SOC Risk Scoring Function
function calculateRisk(event) {
  let riskScore = 0;

  if (event.failedAttempts >= 3) riskScore += 30;
  if (event.newDevice) riskScore += 20;
  if (event.unusualTime) riskScore += 10;
  if (event.suspiciousIP) riskScore += 25;

  return riskScore;
}

// Login Route (main SOC logic)
app.post("/login", (req, res) => {
  const event = req.body;

  const risk = calculateRisk(event);

  let status = "ALLOWED";

  if (risk >= 60) status = "BLOCKED";
  else if (risk >= 30) status = "SUSPICIOUS";

  // Save log
  loginEvents.push({ ...event, risk, status });

  res.json({ status, risk });
});

// View logs (for dashboard/demo)
app.get("/logs", (req, res) => {
  res.json(loginEvents);
});

// Basic test route
app.get("/", (req, res) => {
  res.send("SecureFace SOC backend is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
