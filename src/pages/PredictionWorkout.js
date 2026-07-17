import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import ExerciseModelViewer from "../components/ExerciseModelViewer";
import LiveAnalysisPanel from "../components/LiveAnalysisPanel";
import { analyseBicepCurl } from "../exercises/bicepCurl";
import { analyseSquat } from "../exercises/squat";


import { useAuth } from "../context/AuthContext";
import {
  extractBicepCurlFeatures,
  extractSquatFeatures,
} from "../ml/featureExtractor";
import {
  loadRandomForestModel,
  predictRandomForest,
} from "../ml/randomForestPredictor";
import { saveWorkoutSession } from "../services/sessionService";
import { createMetrics, summarise, updateFrame } from "../utils/metrics";
import usePose from "../vision/usePose";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SquatTrainer from "../components/SquatTrainer";

export default function PredictionWorkout() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const frameSkipRef = useRef(0);
  const { currentUser } = useAuth();

  const stateRef = useRef({ stage: "up", reps: 0 });
  const metricsRef = useRef(createMetrics());
  const previousRepRef = useRef(0);
  const latestLandmarksRef = useRef(null);

  const [exercise, setExercise] = useState("squat");
  const [reps, setReps] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState(null);
  const [trainerLandmarks, setTrainerLandmarks] = useState(null);

  const [models, setModels] = useState({});
  const [mlPrediction, setMlPrediction] = useState("Waiting...");
  const [lastFeatures, setLastFeatures] = useState(null);
  const [liveFeedback, setLiveFeedback] = useState("");
  const [validReps, setValidReps] = useState(0);

  useEffect(() => {
    async function loadModels() {
      try {
        const squatModel = await loadRandomForestModel(
          "/squat_random_forest_model.json",
        );

        const bicepCurlModel = await loadRandomForestModel(
          "/bicepcurl_random_forest_model.json",
        );

        setModels({
          squat: squatModel,
          bicepCurl: bicepCurlModel,
        });

        setMlPrediction("Models loaded");
      } catch (err) {
        console.error(err);
        setMlPrediction("Model load failed");
      }
    }

    loadModels();
  }, []);

  useEffect(() => {
    metricsRef.current = createMetrics();
    stateRef.current = { stage: "up", reps: 0 };
    previousRepRef.current = 0;
    latestLandmarksRef.current = null;
    setReps(0);
    setLiveMetrics(null);
    setMlPrediction("Ready");
    setLastFeatures(null);
    setLiveFeedback("");
    setValidReps(0);
  }, [exercise, models]);

  const drawPose = (results) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (!canvas || !video || !results.poseLandmarks) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 2,
    });

    drawLandmarks(ctx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 1,
    });
  };

  const generateLiveFeedback = (features) => {
    if (!features) return "";

    if (features.knee_angle > 110 && features.depth < 0.12) {
      return "Go lower — squat depth is too shallow";
    }

    if (features.hip_angle > 130) {
      return "Reduce hip bend — keep your chest more upright";
    }

    if (features.back_angle < 15) {
      return "Keep your chest up — avoid leaning forward";
    }

    if (features.symmetry > 20) {
      return "Balance both legs evenly";
    }

    if (features.rep_speed > 0 && features.rep_speed < 1.2) {
      return "Slow down — control the movement";
    }

    return "";
  };

  const onResults = (results) => {
    if (!results.poseLandmarks) return;

    drawPose(results);
    latestLandmarksRef.current = results.poseLandmarks;
    setTrainerLandmarks(results.poseLandmarks);

    updateFrame(metricsRef.current);

    if (exercise === "squat") {
      stateRef.current = analyseSquat(
        results.poseLandmarks,
        stateRef.current,
        metricsRef.current,
      );

      const currentFeatures = extractSquatFeatures(
        results.poseLandmarks,
        metricsRef.current,
      );

      setLiveFeedback(generateLiveFeedback(currentFeatures));
    }

    if (exercise === "bicepCurl") {
      stateRef.current = analyseBicepCurl(
        results.poseLandmarks,
        stateRef.current,
        metricsRef.current,
      );
    }

    setReps(stateRef.current.reps);

    frameSkipRef.current += 1;

    if (frameSkipRef.current % 5 === 0) {
      setLiveMetrics(summarise(metricsRef.current));
    }

    const currentModel = models[exercise];

    if (
      stateRef.current.repCompleted &&
      latestLandmarksRef.current &&
      currentModel
    ) {
      console.log(
  metricsRef.current.completedRep
);
      const landmarksForML =
        metricsRef.current.completedRep?.bestLandmarks ||
        latestLandmarksRef.current;

      let features;

      if (exercise === "squat") {
        features = extractSquatFeatures(landmarksForML, metricsRef.current);
      }

      if (exercise === "bicepCurl") {
        features = extractBicepCurlFeatures(landmarksForML, metricsRef.current);
        console.log("Extracted Features", features);
      }

      const prediction = predictRandomForest(currentModel, features);

      if (prediction === "correct") {
        setValidReps((prev) => prev + 1);
      }

      setMlPrediction(prediction);
      setLastFeatures(features);

      stateRef.current.repCompleted = false;
      previousRepRef.current = stateRef.current.reps;
    }
  };

  usePose(webcamRef, onResults);

  const resetWorkout = () => {
    metricsRef.current = createMetrics();
    stateRef.current = { stage: "up", reps: 0 };
    previousRepRef.current = 0;
    latestLandmarksRef.current = null;
    setReps(0);
    setLiveMetrics(null);
    setMlPrediction("Ready");
    setLastFeatures(null);
    setLiveFeedback("");
    setValidReps(0);
  };

  const finishSession = async () => {
    if (!currentUser) return;

    const report = summarise(metricsRef.current);

    const session = {
      date: new Date().toLocaleDateString(),
      exercise,
      correctReps: validReps,
      duration: report.duration,
      fps: report.fps,
      avgAngle: report.avgAngle,
      estimatedCalories: Number((validReps * 0.32).toFixed(2)),
    };

    await saveWorkoutSession(currentUser.uid, session);

    alert("Workout session saved.");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>AR Fitness Workout</h1>
          <p style={styles.subtitle}>
            Real-time squat guidance using pose estimation and machine learning
          </p>
        </div>

        <div>
          <label>Select Exercise: </label>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            style={styles.select}
          >
            <option value="squat">Squat</option>
            <option value="bicepCurl">Bicep Curl</option>
            <option value="pushup" disabled>
              Pushup (Coming Soon)
            </option>
          </select>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>3D Exercise Demonstration</h2>
          <ExerciseModelViewer modelPath="/models/squat_demo.glb" />
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Live Camera Analysis</h2>

          {/* <div style={styles.videoWrapper}>
            <Webcam ref={webcamRef} style={styles.webcam} />
            <canvas ref={canvasRef} style={styles.canvas} />
          </div> */}
          <div style={styles.videoWrapper}>

    <Webcam
        ref={webcamRef}
        style={styles.webcam}
    />

    <canvas
        ref={canvasRef}
        style={styles.canvas}
    />

    {exercise === "squat" && (
        <div style={styles.threeOverlay}>
            <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}
             gl={{ alpha: true }}
            >

                <ambientLight intensity={1} />

                <directionalLight
                    position={[5, 5, 5]}
                    intensity={2}
                />

                <SquatTrainer landmarks={trainerLandmarks} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                />

            </Canvas>
        </div>
    )}

</div>

          <div style={styles.repBox}>
            <p>Total Correct Reps</p>
            <h1>{validReps}</h1>
          </div>

          <button onClick={resetWorkout} style={styles.button}>
            Reset Workout
          </button>

          <button onClick={finishSession} style={styles.button}>
            Save Session
          </button>
        </section>

        <section style={styles.sidePanel}>
          <div style={styles.predictionBox}>
            <p>ML Prediction</p>
            <h1
              style={{
                color:
                  mlPrediction === "correct"
                    ? "#16a34a"
                    : mlPrediction === "incorrect"
                      ? "#dc2626"
                      : "#2563eb",
              }}
            >
              {mlPrediction}
            </h1>
          </div>

          {liveFeedback && (
            <div style={styles.feedbackBox}>
              <p>Live Feedback</p>
              <h3>{liveFeedback}</h3>
            </div>
          )}

          <LiveAnalysisPanel
            reps={reps}
            metrics={liveMetrics}
            exercise={exercise}
          />

          {lastFeatures && (
            <div style={styles.featureBox}>
              <h3>Last Rep Features</h3>
              {exercise === "squat" && (
                <>
                  <p>Knee Angle: {lastFeatures.knee_angle}</p>
                  <p>Hip Angle: {lastFeatures.hip_angle}</p>
                  <p>Back Angle: {lastFeatures.back_angle}</p>
                  <p>Depth: {lastFeatures.depth}</p>
                  <p>Rep Speed: {lastFeatures.rep_speed}</p>
                  <p>Symmetry: {lastFeatures.symmetry}</p>
                </>
              )}

              {exercise === "bicepCurl" && (
                <>
                  <p>Elbow Angle: {lastFeatures.elbow_angle}</p>
                  <p>Rep Speed: {lastFeatures.rep_speed}</p>
                  <p>Symmetry: {lastFeatures.symmetry}</p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    maxWidth: "1400px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    color: "#6b7280",
    margin: "5px 0 0",
  },
  select: {
    padding: "10px",
    marginLeft: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  mainGrid: {
    maxWidth: "1400px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr 360px",
    gap: "20px",
    alignItems: "start",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginTop: 0,
    fontSize: "20px",
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    margin: "auto",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#111827",
  },
  webcam: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    objectFit: "cover",
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    zIndex: 2,
  },
  repBox: {
    marginTop: "15px",
    background: "#ecfdf5",
    borderRadius: "12px",
    padding: "12px",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  predictionBox: {
    background: "white",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  feedbackBox: {
    background: "#fff7ed",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  featureBox: {
    padding: "16px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    textAlign: "left",
  },
  threeOverlay: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "transparent",
},
};
