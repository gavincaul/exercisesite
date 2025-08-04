import { muscles } from "./muscles.tsx";
export interface Exercise {
    name: string;
    index: number;
    exercise_id: number;
    anatomyImg?: string;
    exerciseImg?: string;
    sets: number;
    reps: number;
    time?: number;
    rest?: number;
    instructions?: string;
    muscles?: muscles[];
  }