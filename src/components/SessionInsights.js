import React from "react";

export default function SessionInsights({ summary }) {
  if (!summary) return null;

  const score = (() => {
    if (summary.avgAngle > 70 && summary.avgAngle < 100) return "Good Form";
    if (summary.avgAngle <= 70) return "Too Shallow";
    return "Overextended";
  })();

  return (
    <div style={styles.wrapper}>
      <h2>Session Analysis</h2>

      <div style={styles.grid}>
        <Card title="Total Reps" value={summary.totalReps} />
        <Card title="Duration" value={`${summary.duration.toFixed(1)} s`} />
        <Card title="Avg Knee Angle" value={`${summary.avgAngle.toFixed(1)}°`} />
        <Card title="Tracking FPS" value={summary.fps.toFixed(1)} />
      </div>

      <div style={styles.feedback}>
        <h3>Movement Quality</h3>
        <p>{score}</p>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "30px",
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "12px",
    width: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  feedback: {
    marginTop: "25px",
    padding: "15px",
    background: "#e5e7eb",
    borderRadius: "8px",
  },
};
