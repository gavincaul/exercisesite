import React, { useState } from "react";
import "./ExerciseCard.css";

export interface Exercise {
  name: string;
  exercise_id: number;
  anatomyImg?: string;
  exerciseImg?: string;
  sets: number;
  reps: number;
  time?: number;
  rest?: number;
  instructions?: string;
}

export default function ExerciseCard({
  name,
  exercise_id,
  anatomyImg,
  exerciseImg,
  sets,
  reps,
  time,
  rest,
  instructions,
}: Exercise) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`exercise-card ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="exercise-summary">
        <img src={exerciseImg} alt={name} className="exercise-img" />
        <div className="exercise-name">{name}</div>
        {time !== null ? <div className="exercise-timer">{time}s</div> : <></>}
        {sets !== null ? (
          <div className="exercise-rate">
            {sets}
            {reps !== 0 && reps !== null ? " " : ""}x {reps}
          </div>
        ) : (
          <></>
        )}
      </div>

      {expanded && (
        <div className="exercise-details">
          <p>
            <strong>Instructions:</strong> {instructions}{" "}
          </p>

          {rest !== null ? (
            <p>
              <strong>Rest Time:</strong> {rest}s{" "}
            </p>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
