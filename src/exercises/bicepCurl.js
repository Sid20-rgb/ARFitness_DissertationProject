import { calculateAngle } from "../workout/repcounter";

export function analyseBicepCurl(landmarks, state, metrics) {
  state.repCompleted = false;
  const shoulder = landmarks[12];
  const elbow = landmarks[14];
  const wrist = landmarks[16];

  const angle = calculateAngle(
    shoulder,
    elbow,
    wrist
  );

  metrics.lastAngle = angle;

  if (!metrics.currentRep) {
    metrics.currentRep = {
      minElbowAngle: 999,
      bestLandmarks: null,
    };
  }

  if (angle < metrics.currentRep.minElbowAngle) {
    metrics.currentRep.minElbowAngle = angle;
    metrics.currentRep.bestLandmarks = landmarks;
  }

  const EXTENDED = 150;
  const FLEXED = 60;

  if (!state.stage) {
    state.stage = "down";
  }

// Arm fully extended
if (angle > EXTENDED && state.stage !== "up") {
  state.stage = "down";
}

// Curl completed
if (angle < FLEXED && state.stage === "down") {
  state.stage = "up";
}

// Count rep when returning to extension
if (angle > EXTENDED && state.stage === "up") {
  state.stage = "down";

  state.reps += 1;
  state.repCompleted = true;

    const now = performance.now();

    if (metrics.lastRepTimestamp) {
      metrics.repTime =
        (now - metrics.lastRepTimestamp) / 1000;
    }

    metrics.lastRepTimestamp = now;

    metrics.completedRep = {
      minElbowAngle:
        metrics.currentRep.minElbowAngle,
      bestLandmarks:
        metrics.currentRep.bestLandmarks,
    };

    metrics.currentRep = {
      minElbowAngle: 999,
      bestLandmarks: null,
    };
  }

  metrics.angles.push(angle);

  return state;
}