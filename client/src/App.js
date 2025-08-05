import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Exercise from "./pages/Exercise.js";
import MovementEncyclopedia from "./pages/MovementEncyclopedia.js";
import MusclesEncyclopedia from "./pages/MusclesEncyclopedia.js";
import About from "./pages/About.js";
import Workouts from "./pages/Workouts.js";
import CreateWorkout from "./pages/CreateWorkout.js";
import LoginPage from "./pages/SignupLogin.js";

function App() {
  return (
    <div>
      <BrowserRouter basename="/exercisesite">
        <Routes>
          <Route path="/exercise" element={<Exercise />} />
          <Route
            path="/movement-encyclopedia"
            element={<MovementEncyclopedia />}
          />
          <Route
            path="/muscles-encyclopedia"
            element={<MusclesEncyclopedia />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-workout" element={<CreateWorkout />} />
          <Route path="/" element={<Workouts />} />
          <Route exact path="*" element={<Workouts />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
