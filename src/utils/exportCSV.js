export function exportSessionsToCSV(sessions) {
  if (!sessions.length) return;

  const headers = ["Date", "Reps", "Duration (s)", "FPS", "Avg Angle"];
  const rows = sessions.map((s) => [
    s.date,
    s.reps,
    s.duration.toFixed(2),
    s.fps.toFixed(2),
    s.avgAngle.toFixed(2),
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");

  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "fitness_session_data.csv");
  document.body.appendChild(link);

  link.click();
}
