const KEY = "fitness_sessions";

export function loadSessions() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSessions(sessions) {
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

// optional helper if needed later
export function clearSessions() {
  localStorage.removeItem(KEY);
}

export function getLastSession() {
  const sessions = loadSessions();
  if (!sessions || sessions.length === 0) return null;
  return sessions[sessions.length - 1];
}
