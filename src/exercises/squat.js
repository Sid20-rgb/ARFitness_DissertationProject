import { calculateAngle } from "../workout/repcounter";

export function analyseSquat(landmarks, state, metrics) {
  const hip = landmarks[24];
  const knee = landmarks[26];
  const ankle = landmarks[28];

  const angle = calculateAngle(hip, knee, ankle);

  // --- store latest angle for live feedback ---
  metrics.lastAngle = angle;

  // --- personalised scaling based on body proportions ---
  const femurLength = Math.hypot(hip.x - knee.x, hip.y - knee.y);
  const dynamicThreshold = 70 + femurLength * 100;

  // Detect downward phase
  if (angle < dynamicThreshold && state.stage === "up") {
    state.stage = "down";
  }

  // Detect completed rep (upward phase)
  if (angle > 160 && state.stage === "down") {
    state.stage = "up";
    state.reps += 1;

    const now = performance.now();

    // --- calculate rep duration (tempo analysis) ---
    if (metrics.lastRepTimestamp) {
      metrics.repTime = (now - metrics.lastRepTimestamp) / 1000;
    }

    metrics.lastRepTimestamp = now;

    // Keep original logging for research dataset
    metrics.repTimes.push(now);
  }

  // Store angle history for later statistical analysis
  metrics.angles.push(angle);

  return state;
}
