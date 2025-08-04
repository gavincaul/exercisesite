import { Exercise } from "./exercise";
export interface WorkoutContextType {
    title: string;
    current: Exercise;
    exercises: Exercise[];
    timeLeft: number;
    index: number;
    isRunning: boolean;
    isResting: boolean;
    setCount: number;
    pause: () => void;
    resume: () => void;
    skip: () => void;
    reset: () => void;
    done: boolean;
    restSeconds: number;
    setIndex: (index: number) => void;
  }