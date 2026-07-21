import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Bar, Line } from "react-chartjs-2";

import { useAuth } from "../context/AuthContext";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
);

export default function Dashboard({sessions, profile}) {
  const { currentUser } = useAuth();

  // const [profile, setProfile] = useState(null);
  
  // const { sessions } = useWorkout();

  // useEffect(() => {
  //   const loadData = async () => {
  //     if (!currentUser) return;

  //     const userProfile = await getUserProfile(currentUser.uid);
  //     const userSessions = await getWorkoutSessions(currentUser.uid);

  //     setProfile(userProfile);
  //     setSessions(userSessions);
  //   };

  //   loadData();
  // }, [currentUser]);

  // useEffect(() => {
  //   const storedProfile = localStorage.getItem("fitnessProfile");

  //   if (storedProfile) {
  //     setProfile(JSON.parse(storedProfile));
  //   }

  //   const sessions = JSON.parse(localStorage.getItem("workoutSessions")) || [];

  //   setSessions(sessions);
  // }, []);

// useEffect(() => {
//   const storedProfile = localStorage.getItem("fitnessProfile");

//   if (storedProfile) {
//     setProfile(JSON.parse(storedProfile));
//   }
// }, []);

  // -------------------------
  // Statistics
  // -------------------------

  const totalCorrectReps = sessions.reduce(
    (sum, s) => sum + Number(s.correctReps || 0),
    0,
  );

  const totalCalories = sessions.reduce(
    (sum, s) => sum + Number(s.estimatedCalories || 0),
    0,
  );

  const currentWeight = Number(profile?.weight || 0);
  const goalWeight = Number(profile?.goalWeight || 0);

  const weightDifference = Math.abs(currentWeight - goalWeight);

  const caloriesNeeded = weightDifference * 7700;

  const avgCalories = sessions.length > 0 ? totalCalories / sessions.length : 0;

  const estimatedSessions =
    avgCalories > 0 ? Math.ceil(caloriesNeeded / avgCalories) : null;

  const goalProgress =
    currentWeight > goalWeight
      ? Math.min(((currentWeight - goalWeight) / currentWeight) * 100, 100)
      : Math.min((currentWeight / goalWeight) * 100, 100);

  // -------------------------
  // Charts
  // -------------------------

  const barData = {
    labels: sessions.map((_, i) => `Session ${i + 1}`),

    datasets: [
      {
        label: "Calories Burned",

        data: sessions.map((s) => s.estimatedCalories),

        backgroundColor: "#22c55e",

        borderRadius: 10,
      },
    ],
  };

  const lineData = {
    labels: sessions.map((_, i) => `Session ${i + 1}`),

    datasets: [
      {
        label: "Correct Repetitions",

        data: sessions.map((s) => s.correctReps),

        borderColor: "#2563eb",

        backgroundColor: "#2563eb",

        tension: 0.4,

        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={styles.page}>
      {/* HERO */}

      <div style={styles.hero}>
        <div>
          <h1 style={styles.title}>
            Welcome back,{" "}
            {profile?.name || currentUser?.displayName || "Athlete"} 👋
          </h1>

          <p style={styles.subtitle}>
            Here's your workout progress. Keep improving your exercise form!
          </p>
        </div>
      </div>

      {/* STATISTICS */}

      <div style={styles.grid}>
        <Card title="BMI" value={profile?.bmi || "--"} />

        <Card title="Body Type" value={profile?.bodyType || "--"} />

        <Card title="Goal Weight" value={`${profile?.goalWeight || "--"} kg`} />

        <Card title="Sessions" value={sessions.length} />

        <Card title="Correct Reps" value={totalCorrectReps} />

        <Card title="Calories" value={`${totalCalories.toFixed(1)} kcal`} />
      </div>

      {/* GOAL */}

      <div style={styles.goalCard}>
        <h2>🎯 Goal Prediction</h2>

        <p>
          Current Weight:
          <strong> {profile?.weight || "--"} kg</strong>
        </p>

        <p>
          Goal Weight:
          <strong> {profile?.goalWeight || "--"} kg</strong>
        </p>

        <p>
          Remaining:
          <strong> {weightDifference.toFixed(1)} kg</strong>
        </p>

        {estimatedSessions ? (
          <p>
            Estimated Sessions Required:
            <strong> {estimatedSessions}</strong>
          </p>
        ) : (
          <p>Complete more workouts for prediction.</p>
        )}

        <ProgressBar value={goalProgress} />
      </div>

      {/* WORKOUT SUMMARY */}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h2>🏋 Workout Summary</h2>

          <p>
            <strong>Total Sessions:</strong> {sessions.length}
          </p>

          <p>
            <strong>Total Correct Reps:</strong> {totalCorrectReps}
          </p>

          <p>
            <strong>Average Calories:</strong> {avgCalories.toFixed(2)} kcal
          </p>

          <p>
            <strong>Latest Session:</strong>{" "}
            {sessions.length
              ? new Date(
                  sessions[sessions.length - 1].date,
                ).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div style={styles.summaryCard}>
          <h2>💪 Fitness Status</h2>

          <p>
            BMI:
            <strong> {profile?.bmi || "--"}</strong>
          </p>

          <p>
            Body Type:
            <strong> {profile?.bodyType || "--"}</strong>
          </p>

          <p>
            Calories Burned:
            <strong> {totalCalories.toFixed(1)} kcal</strong>
          </p>

          <p>
            Goal Progress:
            <strong> {goalProgress.toFixed(0)}%</strong>
          </p>
        </div>
      </div>

      {/* CHARTS */}

      {sessions.length > 0 ? (
        <>
          <div style={styles.chartBox}>
            <h2>📈 Correct Repetitions Progress</h2>

            <Line data={lineData} options={chartOptions} />
          </div>

          <div style={styles.chartBox}>
            <h2>🔥 Calories Burned</h2>

            <Bar data={barData} options={chartOptions} />
          </div>
        </>
      ) : (
        <div style={styles.empty}>
          <h2>No workout sessions yet.</h2>

          <p>Complete a workout and your progress will appear here.</p>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>

      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={styles.progress}>
      <div
        style={{
          ...styles.progressFill,
          width: `${value}%`,
        }}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "linear-gradient(135deg,#eef2ff 0%,#f8fafc 50%,#dbeafe 100%)",
  },

  hero: {
    background: "white",
    borderRadius: "20px",
    padding: "35px",
    marginBottom: "30px",
    boxShadow: "0 12px 30px rgba(0,0,0,.08)",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "12px",
    fontSize: "17px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
    marginBottom: "35px",
  },

  card: {
    background: "#111827",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    transition: "all 0.3s ease",
  },

  cardIcon: {
    fontSize: "28px",
    color: "#2563eb",
    marginBottom: "10px",
  },

  cardTitle: {
    color: "#6b7280",
    marginBottom: "8px",
  },

  cardValue: {
    margin: 0,
    color: "#e1e1e1",
    fontSize: "28px",
  },

  goalCard: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },

  progress: {
    width: "100%",
    height: "18px",
    borderRadius: "20px",
    background: "#e5e7eb",
    overflow: "hidden",
    marginTop: "20px",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#22c55e,#2563eb)",
    borderRadius: "20px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  summaryCard: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },

  chartBox: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },

  empty: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },
};
