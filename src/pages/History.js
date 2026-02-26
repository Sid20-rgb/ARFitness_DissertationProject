import React, { useEffect, useState } from "react";
import { loadSessions, clearSessions } from "../utils/storage";

export default function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Workout History</h1>

      {sessions.length === 0 && <p>No sessions recorded yet.</p>}

      {sessions.map((s, i) => (
        <div key={i} style={{
          background: "#f4f6f8",
          marginBottom: "10px",
          padding: "15px",
          borderRadius: "8px"
        }}>
          <p><strong>Date:</strong> {s.date}</p>
          <p>Reps: {s.reps}</p>
          <p>Duration: {s.duration.toFixed(1)}s</p>
          <p>FPS: {s.fps?.toFixed(1)}</p>
        </div>
      ))}

      {sessions.length > 0 && (
        <button onClick={() => {
          clearSessions();
          setSessions([]);
        }}>
          Clear Data
        </button>
      )}
    </div>
  );
}
