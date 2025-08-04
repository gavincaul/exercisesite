import React, { useState } from "react";
import "./ExerciseCard.css";
import { useWorkout } from "./WorkoutProvider.tsx";

import { Exercise } from "../interfaces/exercise.tsx";


export default function ExerciseCard({
  name,
  index,
  exercise_id,
  anatomyImg,
  exerciseImg,
  sets,
  reps,
  time,
  rest,
  instructions,
  muscles,
}: Exercise) {
  const [expanded, setExpanded] = useState(false);
  const { setIndex } = useWorkout();
  return (
    <div
      className={`exercise-card ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="exercise-summary">
        <img src={exerciseImg} alt={name} className="exercise-img" />
        <div className="exercise-name">{name}</div>
        <div className="exercise-timer">{time}s</div>
        <div className="exercise-rate">
          {sets}
          {reps !== 0 && reps !== null ? " " : ""}x {reps}
        </div>
      </div>

      {expanded && (
        <div className="exercise-details">
          <div>
            <p>
              <strong>Instructions:</strong> {instructions}{" "}
            </p>
            <p>
              <strong>Rest Time:</strong> {rest}s
            </p>
          </div>
          <div>
            <button
              onClick={() => setIndex(index)}
              className="section"
              style={{
                marginTop: "1rem",
                minWidth: "fit-content",
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Skip to This
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
