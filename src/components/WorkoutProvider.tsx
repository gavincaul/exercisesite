import React, { createContext, useContext, useEffect, useState } from "react";

export interface Exercise {
  name: string;
  length: number;
  anatomyImg?: string;
  exerciseImg?: string;
  rate?: { sets: number; reps: number };
  description?: { inst: string; rest: number };
}

interface WorkoutContextType {
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
}

const WorkoutContext = createContext(
  null as unknown as WorkoutContextType | null
);

export function WorkoutProvider({
  exercises,
  title,
  children,
}: {
  exercises: Exercise[];
  title: string;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [setCount, setSetCount] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.length || 0);
  const [isRunning, setIsRunning] = useState(true);
  const [done, setDone] = useState(false);

  const current = exercises[index];
  const totalSets = current.rate?.sets ?? 1;
  const restSeconds = current.description?.rest || 30;

  useEffect(() => {
    if (!isRunning || done) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, done]);

  useEffect(() => {
    if (timeLeft > 0 || done) return;

    if (isResting) {

      setIsResting(false);
      if (setCount <= totalSets) {
        setTimeLeft(current.length);
      }
      return;
    }

    if (setCount < totalSets) {
  
      setIsResting(true);
      setTimeLeft(restSeconds);
      setSetCount((s) => s + 1);
    } else if (index + 1 < exercises.length) {
     
      setIsResting(true);
      setTimeLeft(120);
      setSetCount(1);
      setTimeout(() => {
        setIndex((i) => i + 1);
      }, 0); 
    } else {

      setDone(true);
      setIsRunning(false);
    }
    // eslint-disable-next-line 
  }, [timeLeft, isResting, setCount, totalSets, current, index, exercises.length, done]);

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const skip = () => {
    if (setCount < totalSets ) {
        setSetCount((s) => s + 1);
        setTimeLeft(exercises[index].length);
        setIsResting(false);
        setIsRunning(true);
    }
    else{
    if (index + 1 < exercises.length) {
      setIndex(index + 1);
      setSetCount(1);
      setIsResting(false);
      setTimeLeft(exercises[index + 1].length);
    } else {
      setDone(true);
      setIsRunning(false);
    }
}
  };

  const reset = () => {
    setSetCount(1);
    setIsResting(false);
    setTimeLeft(exercises[index]?.length || 0);
    setDone(false);
    setIsRunning(true);
  };

  return (
    <WorkoutContext.Provider
      value={{
        title,
        current,
        exercises,
        timeLeft,
        index,
        isRunning,
        isResting,
        setCount,
        pause,
        resume,
        skip,
        reset,
        done,
        restSeconds,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
