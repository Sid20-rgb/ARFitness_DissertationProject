export function calculateAngle(a, b, c) {
const radians =
Math.atan2(c.y - b.y, c.x - b.x) -
Math.atan2(a.y - b.y, a.x - b.x);
let angle = Math.abs((radians * 180) / Math.PI);
if (angle > 180) angle = 360 - angle;
return angle;
}

export function countSquat(angle, state) {
if (angle < 90 && state.stage === "up") {
state.stage = "down";
}

if (angle > 160 && state.stage === "down") {
state.stage = "up";
state.reps += 1;
}

return state;
}
