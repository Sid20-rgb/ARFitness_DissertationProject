export function generateFeedback(metrics, state) {
  if (!metrics) return "Initializing...";

  // Low FPS = tracking problem
  if (metrics.fps < 10) {
    return "⚠ Tracking Lost — Adjust Position";
  }

  // Depth analysis (based on knee angle)
  if (metrics.lastAngle) {
    if (metrics.lastAngle > 120) {
      return "⬇ Go Lower";
    }

    if (metrics.lastAngle >= 70 && metrics.lastAngle <= 100) {
      return "✅ Good Depth";
    }
  }

  // Speed control (very rough but effective for demo)
  if (metrics.repTime && metrics.repTime < 0.8) {
    return "⏱ Too Fast — Control Movement";
  }

  return "👍 Keep Going";
}
