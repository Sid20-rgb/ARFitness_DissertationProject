const ML_KEY = "ml_squat_dataset";

export function saveMLSample(features, label, exercise) {
  const existing = JSON.parse(localStorage.getItem(ML_KEY) || "[]");

  existing.push({
    exercise,
    ...features,
    form_quality: label,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem(ML_KEY, JSON.stringify(existing));
}

export function loadMLSamples() {
  return JSON.parse(localStorage.getItem(ML_KEY) || "[]");
}

export function clearMLSamples() {
  localStorage.removeItem(ML_KEY);
}

export function exportMLDatasetCSV(exercise) {
  const data = loadMLSamples().filter(
    (row) => row.exercise === exercise
  );

  if (!data.length) return;

  let headers = [];

  if (exercise === "squat") {
    headers = [
      "knee_angle",
      "hip_angle",
      "back_angle",
      "depth",
      "rep_speed",
      "symmetry",
      "form_quality",
      "timestamp",
    ];
  }

  if (exercise === "bicepCurl") {
    headers = [
      "elbow_angle",
      "rep_speed",
      "symmetry",
      "form_quality",
      "timestamp",
    ];
  }

  const rows = data.map((row) =>
    headers.map((h) => row[h])
  );

  const csv =
    [headers, ...rows]
      .map((r) => r.join(","))
      .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${exercise}_dataset.csv`;
  a.click();

  URL.revokeObjectURL(url);
}