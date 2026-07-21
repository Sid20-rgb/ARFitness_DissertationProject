import React, { useEffect, useState } from "react";
import "./Setup.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveUserProfile } from "../services/profileService";


export default function Setup({ saveProfile }) {
const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
    experience: "beginner",
    distance: "",
    bmi: "",
    bodyType: "",
  });

  useEffect(() => {
    if (!form.height || !form.weight) return;

    const h = Number(form.height) / 100;
    const calculatedBMI = Number(form.weight) / (h * h);

    let type = "";
    if (calculatedBMI < 18.5) type = "Underweight";
    else if (calculatedBMI < 25) type = "Normal";
    else if (calculatedBMI < 30) type = "Overweight";
    else type = "Obese";

    setForm((prev) => ({
      ...prev,
      bmi: calculatedBMI.toFixed(1),
      bodyType: type,
    }));
  }, [form.height, form.weight]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!currentUser) return;

//   await saveUserProfile(currentUser.uid, {
//     ...form,
//     email: currentUser.email,
//     name: currentUser.displayName,
//   });

//   localStorage.setItem("fitnessProfile", JSON.stringify(form));

//   navigate("/dashboard");
// };


const handleSubmit = (e) => {
  e.preventDefault();

  saveProfile(form);

  navigate("/dashboard");
};

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h1>Welcome to AR Fitness Trainer</h1>
        <p className="subtitle">
          Calibrate your profile and environment for personalised analysis.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Age</label>
          <input name="age" type="number" required onChange={handleChange} />

          <label>Height (cm)</label>
          <input name="height" type="number" required onChange={handleChange} />

          <label>Weight (kg)</label>
          <input name="weight" type="number" required onChange={handleChange} />

          <label>Goal Weight (kg)</label>
          <input name="goalWeight" type="number" required onChange={handleChange} />

          <label>Experience Level</label>
          <select name="experience" onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <label>Camera Distance (meters)</label>
          <input
            name="distance"
            type="number"
            step="0.1"
            placeholder="e.g. 2"
            required
            onChange={handleChange}
          />

          {form.bmi && (
            <div style={{ marginTop: "15px" }}>
              <strong>BMI:</strong> {form.bmi}
              <br />
              <strong>Body Type:</strong> {form.bodyType}
            </div>
          )}

          <button type="submit">Start Workout</button>
        </form>
      </div>
    </div>
  );
}