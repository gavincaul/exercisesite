import React from "react";
import ExerciseCard from "./ExerciseCardOnly.tsx"; 
import "./GroupedExercises.css";
export default function GroupedExercisesOnly({ groupedData }) {
  return (
    <div className="grouped-container">
      <div className="exercise-list">
        {groupedData.exercises.map((exercise, idx) => (
          <ExerciseCard
          index={idx}
            exercise_id={exercise.exercise_id}
            name={exercise.movement_name || `Exercise #${exercise.exercise_id}`}
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
            muscles={exercise.muscles}
          />
        ))}
      </div>
    </div>
  );
}
