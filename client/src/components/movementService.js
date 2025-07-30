import axios from "axios";

export async function getAllMovements() {
  const res = await axios.get("http://localhost:3001/api/movement");
  return res.data;
}
export async function getAllMuscles() {
  const res = await axios.get("http://localhost:3001/api/muscles");
  return res.data;
}

export async function getGlobalWorkouts() {
  const res = await axios.get("http://localhost:3001/api/routine");
  return res.data;
}

export async function getRoutineNums() {
  const res = await axios.get("http://localhost:3001/api/routineIDs");
  return res.data;
}
