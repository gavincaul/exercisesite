import React, { createContext, useContext, useEffect, useState } from "react";

import { Exercise } from "../interfaces/exercise.tsx";
import { WorkoutContextType } from "../interfaces/workout.tsx";

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
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.time || 0);
  const [isRunning, setIsRunning] = useState(true);
  const [done, setDone] = useState(false);
  const current = exercises[index];
  const totalSets = current.sets && current.sets > 0 ? current.sets : 1;
  const restSeconds = current.rest || 30;

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
        setTimeLeft(current.time || 180);
      }
      return;
    }
    
    if (setCount < totalSets) {
  
      setIsResting(true);
      setTimeLeft(restSeconds);
      setSetCount((s) => s + 1);
    } else if (index + 1 < exercises.length) {
     
      setIsResting(true);
      setTimeLeft(restSeconds);
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
    if (isResting) {
      setIsResting(false);
      setTimeLeft(current.time || 180);
      return;
    }
    if (setCount < totalSets ) {
        setSetCount((s) => s + 1);
        setTimeLeft(exercises[index].time || 180);
        setIsResting(false);
        setIsRunning(true);
    }
    else{
    if (index + 1 < exercises.length) {
      setIndex(index + 1);
      setSetCount(1);
      setIsResting(false);
      setTimeLeft(exercises[index + 1].time || 180);
    } else {
      setDone(true);
      setIsRunning(false);
    }
}
  };

  const reset = () => {
    setSetCount(1);
    setIsResting(false);
    setTimeLeft(exercises[index]?.time || 0);
    setDone(false);
    setIsRunning(true);
  };
  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
    setSetCount(1);
    setIsResting(false);
    setTimeLeft(exercises[newIndex]?.time || 180);
    setIsRunning(false);  
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
        setIndex: handleSetIndex,
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
