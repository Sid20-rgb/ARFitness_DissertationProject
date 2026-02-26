export function compareSessions(current, previous) {
  if (!previous) {
    return {
      message: "First recorded session — no comparison available.",
      improvement: 0,
    };
  }

  const repChange =
    ((current.reps - previous.reps) / Math.max(previous.reps, 1)) * 100;

  const angleChange =
    ((previous.avgAngle - current.avgAngle) / previous.avgAngle) * 100;

  let message = "";

  if (repChange > 10) {
    message = "📈 Repetition performance improved.";
  } else if (repChange < -10) {
    message = "⚠ Repetition count decreased — possible fatigue.";
  } else {
    message = "➖ Repetition performance stable.";
  }

  if (angleChange > 5) {
    message += " Movement depth improved.";
  } else if (angleChange < -5) {
    message += " Reduced squat depth detected.";
  }

  return {
    message,
    improvement: repChange.toFixed(1),
  };
}
