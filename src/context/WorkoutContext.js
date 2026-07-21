import { createContext, useContext, useState } from "react";

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const [sessions, setSessions] = useState([]);

  const addSession = (session) => {
    setSessions((prev) => [...prev, session]);
  };

  const clearSessions = () => {
    setSessions([]);
  };

  return (
    <WorkoutContext.Provider
      value={{
        sessions,
        addSession,
        clearSessions,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}