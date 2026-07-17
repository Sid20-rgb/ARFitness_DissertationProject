import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "./logoar.png";

export default function Login() {
  const {  loginWithEmail } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);



  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await loginWithEmail(email, password);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.circleOne}></div>
      <div style={styles.circleTwo}></div>

      <div style={styles.wrapper}>
        <img src={logo} alt="AR Fitness Trainer" style={styles.logo} />

        <div style={styles.card}>
          <h1 style={styles.title}>AI-Powered AR Fitness Trainer</h1>

          <p style={styles.subtitle}>
            Improve exercise performance using MediaPipe Pose Estimation,
            Machine Learning and Augmented Reality guidance.
          </p>

           <div style={styles.features}>
            <div style={styles.feature}>🦴 Pose Tracking</div>
            <div style={styles.feature}>🤖 Machine Learning</div>
            <div style={styles.feature}>🥇 Form Analysis</div>
            <div style={styles.feature}>📊 Progress Reports</div>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
            />

            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            style={styles.loginButton}
            onClick={handleEmailLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

         


          
        </div>

      
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",

    background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%)",
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
  },

  logo: {
    width: "260px",
    marginTop: "-100px",
    marginBottom: "-60px",
    userSelect: "none",
  },

  card: {
    width: "520px",
    padding: "40px",

    borderRadius: "24px",

    background: "rgba(255,255,255,.12)",

    backdropFilter: "blur(16px)",

    border: "1px solid rgba(255,255,255,.2)",

    boxShadow: "0 20px 60px rgba(0,0,0,.35)",

    textAlign: "center",

    color: "white",
  },

  title: {
    marginTop: 0,
    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  subtitle: {
    fontSize: "16px",
    lineHeight: 1.7,
    opacity: 0.9,
    marginBottom: "30px",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "35px",
  },

  feature: {
    padding: "14px",

    background: "rgba(255,255,255,.08)",

    border: "1px solid rgba(255,255,255,.15)",

    borderRadius: "12px",

    fontWeight: "500",

    fontSize: "15px",
  },

  button: {
    width: "100%",

    padding: "16px",

    fontSize: "17px",

    fontWeight: "600",

    borderRadius: "12px",

    border: "none",

    cursor: "pointer",

    background: "#ffffff",

    color: "#1e3a8a",

    transition: ".2s",
  },

  footer: {
    marginTop: "25px",
    fontSize: "14px",
    opacity: 0.8,
    lineHeight: 1.5,
  },

  credit: {
    marginTop: "20px",
    color: "white",
    opacity: 0.8,
    textAlign: "center",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  circleOne: {
    position: "absolute",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background: "#3b82f6",
    filter: "blur(170px)",
    top: "-120px",
    left: "-120px",
    opacity: 0.45,
  },

  circleTwo: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "#60a5fa",
    filter: "blur(190px)",
    bottom: "-180px",
    right: "-180px",
    opacity: 0.35,
  },
};
