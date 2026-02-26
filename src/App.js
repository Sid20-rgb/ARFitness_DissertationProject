import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Workout from "./pages/Workout";
import Dashboard from "./pages/Dashboard";
import { loadSessions, saveSessions } from "./data/storage";
import Setup from "./pages/Setup";


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

const [userProfile, setUserProfile] = useState(null);
const handleStart = (profile) => {
  setUserProfile(profile);
};


return ( <BrowserRouter> <Navbar /> <Routes>
<Route
  path="/"
  element={
    !userProfile ? (
      <Setup onStart={handleStart} />
    ) : (
      <Workout saveSession={addSession} userProfile={userProfile} />
    )
  }
/>
<Route path="/dashboard" element={<Dashboard sessions={sessions} />} /> </Routes> </BrowserRouter>
);
}
