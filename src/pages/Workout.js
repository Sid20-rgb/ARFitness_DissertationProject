import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import usePose from "../vision/usePose";
import { calculateAngle, countSquat } from "../workout/repcounter";
import { createMetrics } from "../utils/metrics";
import { updateFrame } from "../utils/metrics";
import { analyseSquat } from "../exercises/squat";
import { summarise } from "../utils/metrics";
import { saveSession } from "../data/storage";
import LiveAnalysisPanel from "../components/LiveAnalysisPanel";
import SessionInsights from "../components/SessionInsights";
import { useEffect } from "react";
import { getLastSession } from "../data/storage";
import { compareSessions } from "../analysis/comparison";
import ProgressComparison from "../components/ProgressComparison";




export default function Workout({ saveSession })
{
const webcamRef = useRef(null);
const [reps, setReps] = useState(0);
const stateRef = useRef({ stage: "up", reps: 0 });

const [exercise, setExercise] = useState("squat");
const metricsRef = useRef(createMetrics());
const [summary, setSummary] = useState(null);
const [liveMetrics, setLiveMetrics] = useState(null);
const [finalSummary, setFinalSummary] = useState(null);
const [comparison, setComparison] = useState(null);


useEffect(() => {
  // Reset session when exercise changes
  metricsRef.current = createMetrics();
  stateRef.current = { stage: "up", reps: 0 };
  setReps(0);
  setLiveMetrics(null);
}, [exercise]);



const onResults = (results) => {
  if (!results.poseLandmarks) return;

  updateFrame(metricsRef.current);

switch (exercise) {
  case "squat":
    stateRef.current = analyseSquat(
      results.poseLandmarks,
      stateRef.current,
      metricsRef.current
    );
    break;

  default:
    break;
}


  setReps(stateRef.current.reps);
  const snapshot = summarise(metricsRef.current);
  setLiveMetrics(snapshot);

};

usePose(webcamRef, onResults);

const finishWorkout = () => {
  const report = summarise(metricsRef.current);

  const sessionData = {
    date: new Date().toLocaleDateString(),
    reps: report.totalReps,
    fps: report.fps,
    duration: report.duration,
    avgAngle: report.avgAngle,
  };

  const previous = getLastSession();
  const comparisonResult = compareSessions(sessionData, previous);

  saveSession(sessionData);

  setComparison(comparisonResult);
  setFinalSummary(report);

  metricsRef.current = createMetrics();
  stateRef.current = { stage: "up", reps: 0 };
  setReps(0);
};



return (
  <div>
    {/* === LIVE WORKOUT SECTION === */}
    <div style={styles.container}>
      <div style={styles.cameraSection}>
        <h1>Workout Session</h1>
        <div style={{ marginBottom: "15px" }}>
  <label>Select Exercise: </label>

  <select
    value={exercise}
    onChange={(e) => setExercise(e.target.value)}
    style={{
      padding: "8px",
      marginLeft: "10px",
      borderRadius: "6px"
    }}
  >
    <option value="squat">Squat</option>
    <option value="lunge" disabled>Lunge (Coming Soon)</option>
    <option value="pushup" disabled>Pushup (Coming Soon)</option>
  </select>
</div>


        <Webcam
          ref={webcamRef}
          style={{ width: 640, borderRadius: "10px" }}
        />

        <h2>Reps: {reps}</h2>

        <button onClick={finishWorkout} style={styles.button}>
          Finish Session
        </button>
      </div>

      <LiveAnalysisPanel
  reps={reps}
  metrics={liveMetrics}
  exercise={exercise}
/>

    </div>

    {/* === POST-SESSION ANALYSIS (Appears After Finish) === */}
    {finalSummary && <SessionInsights summary={finalSummary} />}
    {comparison && <ProgressComparison result={comparison} />}
  </div>
);

}


const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: "40px",
  },
  cameraSection: {
    textAlign: "center",
  },
  button: {
    padding: "12px 20px",
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};


