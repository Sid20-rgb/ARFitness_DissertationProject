import "@google/model-viewer";

export default function ExerciseModelViewer({ modelPath }) {
  return (
    <div style={styles.wrapper}>
      <h2>3D Exercise Demonstration</h2>

      <model-viewer
        src={modelPath}
        alt="3D animated exercise demonstration"
        camera-controls
        autoplay
        animation-name="*"
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        exposure="1"
        style={styles.viewer}
      ></model-viewer>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "20px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "12px",
    textAlign: "center",
  },
  viewer: {
    width: "100%",
    height: "420px",
    background: "#eef2ff",
    borderRadius: "10px",
  },
};