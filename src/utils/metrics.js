export function createMetrics() {
  return {
    startTime: performance.now(),
    frames: 0,
    angles: [],
    repTimes: [],

    // Added for intelligent feedback
    lastAngle: 0,
    repTime: 0,
    lastRepTimestamp: 0,
  };
}



export function updateFrame(metrics) {
metrics.frameCount += 1;
}

export function summarise(metrics) {
const duration = (performance.now() - metrics.startTime) / 1000;
const fps = metrics.frameCount / duration;

return {
duration,
fps,
totalReps: metrics.repTimes.length,
avgAngle:
metrics.angles.reduce((a, b) => a + b, 0) / metrics.angles.length,
};
}
