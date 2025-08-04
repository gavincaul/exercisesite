import axios from "axios";
const BASE_URL = "https://exercisesite-1e7b88b40e5c.herokuapp.com/";
export async function getAllMovements() {
  const res = await axios.get(`${BASE_URL}/api/movement`);
  return res.data;
}
export async function getAllMuscles() {
  const res = await axios.get(`${BASE_URL}/api/muscles`);
  return res.data;
}

export async function getGlobalWorkouts() {
  const res = await axios.get(`${BASE_URL}/api/routine/global`);
  return res.data;
}
export async function getUserWorkouts(userId) {
  const res = await axios.get(`${BASE_URL}/api/routine/user/${userId}`);
  return res.data;
}

export async function getRoutineNums() {
  const res = await axios.get(`${BASE_URL}/api/routineIDs`);
  return res.data;
}

export async function organizePostData(workoutData, workouts) {
  const workout_id = workoutData.id;
  const routine = {};
  routine.name = workoutData.name;
  routine.description = workoutData.description;
  routine.user_id = workoutData.user_id;
  routine.id = workout_id;
  const exerciseList = workouts.map(workout => {
    return {
      movement: workout.id,
      sets: workout.sets,
      reps: workout.reps,
      time: workout.time,
      instructions: workout.description,
      routine_id: workout_id
    };
  }
  );
  return await postRoutineWithExercises(routine, exerciseList);

}


export async function postRoutineWithExercises(routine, exerciseList) {
  try {
    const payload = {
      routine,
      exerciseList,
    };

    const res = await axios.post(`${BASE_URL}/api/postRoutines`, payload);

    return res.data; 
  } catch (error) {
    console.error("Error posting routine:", error.response?.data || error.message);
    throw error;
  }
}


export async function signup(email, password, inviteCode) {
  const res = await axios.post(`${BASE_URL}/api/auth/signup`, { email, password, inviteCode });
  return res.data;
}

export async function login(email, password) {
  const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
  return res.data;
}

export function getUser() {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data from localStorage", error);
    return null;
  }
}