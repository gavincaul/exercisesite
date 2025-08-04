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

  const totalDuration = isResting ? restSeconds : current.time;
  const degree = (360 / totalDuration) * (totalDuration - timeLeft);

  return (
    <div className="countdown">
      <div className="set-rep-line">
        {isResting ? (
          <p>Resting...</p>
        ) : (
          <div>
            {current.sets !== null && current.sets > 0 ? (
              <span className="set">{`Set ${setCount} of ${current.sets}`}</span>
            ) : null}{" "}
            {current.reps !== null && current.reps > 0 ? (
              <span className="rep">{`Reps: ${current.reps}`}</span>
            ) : null}
          </div>
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
