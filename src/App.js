import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PredictionWorkout from "./pages/PredictionWorkout";
import DataCollectionWorkout from "./pages/DataCollectionWorkout";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { loadSessions, saveSessions } from "./data/storage";

export default function App() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const addSession = (session) => {
    const updated = [...sessions, session];
    setSessions(updated);
    saveSessions(updated);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Setup />} />
          <Route path="/workout" element={<PredictionWorkout saveSession={addSession} />} />
          <Route path="/data-collection" element={<DataCollectionWorkout saveSession={addSession} />} />
          <Route path="/dashboard" element={<Dashboard sessions={sessions} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}