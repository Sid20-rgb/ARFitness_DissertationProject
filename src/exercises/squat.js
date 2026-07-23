import { calculateAngle } from "../workout/repcounter";

export function analyseSquat(landmarks, state, metrics) {
  const hip = landmarks[24];
  const knee = landmarks[26];
  const ankle = landmarks[28];

  const angle = calculateAngle(hip, knee, ankle);
  const depth = Math.abs(hip.y - knee.y);

  metrics.lastAngle = angle;

  if (!metrics.currentRep) {
    metrics.currentRep = {
      minKneeAngle: 999,
      maxDepth: 0,
      bestLandmarks: null,
    };
  }

  if (angle < metrics.currentRep.minKneeAngle) {
    metrics.currentRep.minKneeAngle = angle;
    metrics.currentRep.bestLandmarks = landmarks;
  }

  if (depth > metrics.currentRep.maxDepth) {
    metrics.currentRep.maxDepth = depth;
  }

  const STAND_ANGLE = 150;
  const SQUAT_ANGLE = 110;

  if (!state.stage) {
    state.stage = "standing";
  }

  if (angle > STAND_ANGLE && state.stage !== "down") {
    state.stage = "standing";
  }

  if (angle < SQUAT_ANGLE && state.stage === "standing") {
    state.stage = "down";
  }

if (angle > STAND_ANGLE && state.stage === "down") {
  state.stage = "standing";

  state.reps += 1;     
  state.repCompleted = true;

  const now = performance.now();

  if (metrics.lastRepTimestamp) {
    metrics.repTime = (now - metrics.lastRepTimestamp) / 1000;
  }

  metrics.lastRepTimestamp = now;
  metrics.repTimes.push(now);

  metrics.completedRep = {
    minKneeAngle: metrics.currentRep.minKneeAngle,
    maxDepth: metrics.currentRep.maxDepth,
    bestLandmarks: metrics.currentRep.bestLandmarks,
  };

  metrics.currentRep = {
    minKneeAngle: 999,
    maxDepth: 0,
    bestLandmarks: null,
  };
}

  metrics.angles.push(angle);

  return state;
}