import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { exportSessionsToCSV } from "../utils/exportCSV";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard({ sessions }) {
  if (!sessions.length) {
    return <h2 style={{ textAlign: "center" }}>No sessions recorded yet.</h2>;
  }

  const labels = sessions.map((s) => s.date);

  const repsData = sessions.map((s) => s.reps);
  const durationData = sessions.map((s) => s.duration);
  const fpsData = sessions.map((s) => s.fps);

  const data = {
    labels,
    datasets: [
      {
        label: "Repetitions",
        data: repsData,
      },
      {
        label: "Workout Duration (s)",
        data: durationData,
      },
      {
        label: "Processing FPS",
        data: fpsData,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Workout Performance Overview" },
    },
  };

  // ---- Simple Research Statistics ----
  const avgReps =
    repsData.reduce((a, b) => a + b, 0) / repsData.length;

  const avgDuration =
    durationData.reduce((a, b) => a + b, 0) / durationData.length;

  const avgFPS =
    fpsData.reduce((a, b) => a + b, 0) / fpsData.length;

  return (
    

    <div style={{ width: "700px", margin: "auto", textAlign: "center" }}>
      <h1>Progress Dashboard</h1>

      <Bar data={data} options={options} />

      <button
  onClick={() => exportSessionsToCSV(sessions)}
  style={{
    marginBottom: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  Download Session Data (CSV)
</button>


      <div style={{ marginTop: "30px", textAlign: "left" }}>
        <h3>Session Analytics</h3>
        <p><strong>Average Repetitions:</strong> {avgReps.toFixed(1)}</p>
        <p><strong>Average Duration:</strong> {avgDuration.toFixed(1)} seconds</p>
        <p><strong>Average Processing Speed:</strong> {avgFPS.toFixed(1)} FPS</p>
      </div>
    </div>
  );
}
