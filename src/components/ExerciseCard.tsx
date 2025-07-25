import React, { useState } from "react";
import "./ExerciseCard.css";

export interface Exercise {
  name: string;
  length: number;
  anatomyImg?: string;
  exerciseImg?: string;
  rate?: { sets: number; reps: number };
  description?: { inst: string; rest: number };
}

export default function ExerciseCard({
  name,
  length,
  anatomyImg,
  exerciseImg,
  rate,
  description,
}: ExerciseProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`exercise-card ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="exercise-summary">
        <img src={exerciseImg} alt={name} className="exercise-img" />
        <div className="exercise-name">{name}</div>
        <div className="exercise-timer">{length}s</div>
        <div className="exercise-rate">
          {rate.sets} x {rate.reps}
        </div>
      </div>

      {expanded && (
        <div className="exercise-details">
          <p>
            <strong>Instructions:</strong> {description.inst}{" "}
          </p>
          <p>
            <strong>Rest Time:</strong> {description.rest}
          </p>
        </div>
      )}
    </div>
  );
}
