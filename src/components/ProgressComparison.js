import React from "react";

export default function ProgressComparison({ result }) {
  if (!result) return null;

  return (
    <div style={styles.container}>
      <h2>Progress Analysis</h2>

      <p style={styles.message}>{result.message}</p>

      <div style={styles.metric}>
        Performance Change: <strong>{result.improvement}%</strong>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "30px",
    padding: "20px",
    background: "#0f172a",
    color: "white",
    borderRadius: "10px",
    textAlign: "center",
  },
  message: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  metric: {
    fontSize: "16px",
    opacity: 0.8,
  },
};
