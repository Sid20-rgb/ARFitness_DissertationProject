export default function ExerciseSelector({ current, setExercise }) {
return (
<div style={{ marginBottom: "20px" }}>
<button onClick={() => setExercise("squat")}>
Squat </button> </div>
);
}
