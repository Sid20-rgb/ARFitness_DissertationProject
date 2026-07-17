import { calculateAngle } from "../workout/repcounter";

export function extractSquatFeatures(landmarks, metrics) {
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];

  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];

  const rightShoulder = landmarks[12];

  // Knee bend: hip → knee → ankle
  const kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  // Hip bend: shoulder → hip → knee
  const hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

  // Back/torso angle relative to vertical
  const verticalPoint = {
    x: rightHip.x,
    y: rightHip.y - 1,
  };

  const backAngle = calculateAngle(rightShoulder, rightHip, verticalPoint);

  const depth = Math.abs(rightHip.y - rightKnee.y);

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const symmetry = Math.abs(leftKneeAngle - kneeAngle);

  return {
    knee_angle: Number(kneeAngle.toFixed(2)),
    hip_angle: Number(hipAngle.toFixed(2)),
    back_angle: Number(backAngle.toFixed(2)),
    depth: Number(depth.toFixed(4)),
    rep_speed: Number((metrics.repTime || 0).toFixed(2)),
    symmetry: Number(symmetry.toFixed(2)),
  };
}


export function extractBicepCurlFeatures(
  landmarks,
  metrics
) {
  const shoulder = landmarks[12];
  const elbow = landmarks[14];
  const wrist = landmarks[16];

  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];

  const elbowAngle =
    calculateAngle(
      shoulder,
      elbow,
      wrist
    );

  const leftElbowAngle =
    calculateAngle(
      leftShoulder,
      leftElbow,
      leftWrist
    );

  const symmetry =
    Math.abs(
      elbowAngle - leftElbowAngle
    );

  return {
    elbow_angle: Number(
      elbowAngle.toFixed(2)
    ),

    rep_speed: Number(
      (metrics.repTime || 0).toFixed(2)
    ),

    symmetry: Number(
      symmetry.toFixed(2)
    ),
  };
}