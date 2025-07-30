// GroupedExercises.tsx
import React from "react";
import ExerciseCard from "./ExerciseCard.tsx";
import "./GroupedExercises.css";

export interface Exercise {
  name: string;
  length: number;
  anatomyImg?: string;
  exerciseImg?: string;
  rate?: { sets: number; reps: number };
  description?: { inst: string; rest: number };
}


export default function GroupedExercises({ groupedData }) {
  return (
    <div className="grouped-container">
      {groupedData.map((group) => (
        <div key={group.routine_name} className="group">
          <h2 className="group-title">{group.routine_name}</h2>
          {group.exercises.map((exercise, idx) => (
            <ExerciseCard key={idx} {...exercise} />
          ))}
        </div>
      ))}
    </div>
  );
}
