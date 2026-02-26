import React from "react";
import { generateFeedback } from "../analysis/feedback";

export default function LiveAnalysisPanel({ reps, metrics, exercise }) {
  if (!metrics) return null;

  const format = (num) => (num ? num.toFixed(1) : "0");
  const feedback = generateFeedback(metrics);


  return (
    <div style={styles.panel}>
      <h2 style={styles.title}>Live Analysis</h2>
      <p style={{ opacity: 0.7, marginBottom: "15px" }}>
  Exercise: {exercise}
</p>

      <div style={styles.card}>
        <p>Repetitions</p>
        <h3>{reps}</h3>
      </div>

      <div style={styles.card}>
        <p>Session Duration</p>
        <h3>{format(metrics.duration)} s</h3>
      </div>

      <div style={styles.card}>
        <p>Tracking FPS</p>
        <h3>{format(metrics.fps)}</h3>
      </div>

      <div style={styles.card}>
        <p>Average Knee Angle</p>
        <h3>{format(metrics.avgAngle)}°</h3>
      </div>

      <div style={styles.feedback}>
  {feedback}
</div>

<div style={styles.status}>

        {metrics.fps < 15 ? "⚠ Low Tracking Stability" : "✓ Tracking Stable"}
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: "320px",
    padding: "20px",
    background: "#111827",
    color: "white",
    borderRadius: "12px",
    marginLeft: "20px",
  },
  title: {
    marginBottom: "20px",
  },
  card: {
    background: "#1f2933",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "8px",
  },
  status: {
    marginTop: "20px",
    padding: "10px",
    background: "#374151",
    borderRadius: "6px",
    textAlign: "center",
  },

  feedback: {
  marginTop: "10px",
  marginBottom: "10px",
  padding: "12px",
  background: "#2563eb",
  borderRadius: "6px",
  textAlign: "center",
  fontWeight: "bold",
},

};
