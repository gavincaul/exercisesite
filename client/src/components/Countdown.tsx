import React from "react";
import "./Countdown.css";
import { useWorkout } from "../components/WorkoutProvider.tsx";

export default function Countdown() {
  const {
    timeLeft,
    current,
    restSeconds,
    isResting,
    setCount,
    isRunning,
    pause,
    resume,
    skip,
    reset,
  } = useWorkout();

  const totalDuration = isResting ? restSeconds : current.length;
  const degree = (360 / totalDuration) * (totalDuration - timeLeft);
  console.log(restSeconds);

  return (
    <div className="countdown">
      <div className="set-rep-line">
        {isResting ? (
          <p>Resting...</p>
        ) : (
          <>
            <span className="set">{`Set ${setCount} of ${current.rate?.sets}`}</span>
            <span className="rep">{`Reps ${current.rate?.reps}`}</span>
          </>
        )}
      </div>{" "}
      <div className="part seconds">
        <div
          className="number"
          style={{ "--degree": `${degree}deg` } as React.CSSProperties}
        >
          {timeLeft}
        </div>
        <div className="text">
          {isResting ? "Next exercise: " : ""}
          {current.name}
        </div>
      </div>
      <div className="controls">
        <button onClick={isRunning ? pause : resume}>
          {isRunning ? "Pause" : "Play"}
        </button>
        <button onClick={skip}>Skip</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
