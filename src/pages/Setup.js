import React, { useState } from "react";
import "./Setup.css";

export default function Setup({ onStart }) {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    experience: "beginner",
    distance: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(form);
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h1>Welcome to AR Fitness Trainer</h1>
        <p className="subtitle">
          Calibrate your environment for accurate motion tracking.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Height (cm)</label>
          <input
            name="height"
            type="number"
            required
            onChange={handleChange}
          />

          <label>Weight (kg)</label>
          <input
            name="weight"
            type="number"
            required
            onChange={handleChange}
          />

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

          <button type="submit">Start Workout</button>
        </form>
      </div>
    </div>
  );
}
