import React from "react";
import ExerciseCard from "./ExerciseCard.tsx"; // Make sure this accepts movement_name!
import "./GroupedExercises.css";
import { useNavigate } from "react-router-dom";
export default function GroupedExercises({ groupedData }) {
  const navigate = useNavigate();
  console.log(groupedData);
  return (
    <div className="grouped-container">
      <div key={groupedData.routine_id} className="group">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 className="group-title">{groupedData.routine_name}</h2>
          <button
            onClick={() =>
              navigate("/exercise", {
                state: { group: groupedData },
              })
            }
            className="section"
            style={{
              width: "fit-content",
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              marginRight: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          >
            Start
          </button>
        </div>
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          {groupedData.routine_description}
        </p>
        <div className="exercise-list">
          {groupedData.exercises.map((exercise, idx) => (
            <ExerciseCard
              key={idx}
              exercise_id={exercise.exercise_id}
              name={
                exercise.movement_name || `Exercise #${exercise.exercise_id}`
              }
              anatomyImg={`/anatomy/${exercise.movement_name
                .replace(/\s*[-–]\s*/g, "-")
                .replace(/\s+/g, "_")}.jpg`}
              exerciseImg={`/anatomy/${exercise.movement_name
                .replace(/\s*[-–]\s*/g, "-")
                .replace(/\s+/g, "_")}.jpg`}
              sets={exercise.sets}
              reps={exercise.reps}
              time={exercise.time}
              rest={exercise.rest}
              instructions={exercise.instructions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
