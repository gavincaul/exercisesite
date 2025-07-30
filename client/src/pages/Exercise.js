import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Exercise.css";
import Countdown from "../components/Countdown.tsx";
import GroupedExercises from "../components/GroupedExercises.tsx";
import { WorkoutProvider, useWorkout } from "../components/WorkoutProvider.tsx";
import { useNavigate } from "react-router-dom"; 

function ExerciseLayout() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("timer");
  const sections = ["timer", "anatomy", "movement", "exercises"];
  const { current, title, exercises, done} = useWorkout();

   if (done) {
    return (
      <div className="background">
        <div className="centerconsole" style={{ textAlign: "center", padding: "2rem" }}>
          <h1 className="title">🎉 Congrats!</h1>
          <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
            You’ve completed the <strong>{title}</strong> workout.
          </p>
          <button
            className="section"
            onClick={() => navigate("/")}
            style={{
              alignSelf: "center",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              marginTop: "2rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="background">
      <div className="centerconsole">
        <div className="title">{title}</div>
        <div
          className={`main-content ${
            activeSection === "exercises" ? "scrolling" : "centered"
          }`}
        >
          {activeSection === "timer" && <Countdown />}

          {activeSection === "anatomy" && (
            <div className="anatomy">
              <h2 className="anatomy-title">{current.name} Anatomy</h2>
              <img
                className="anatomy-img"
                src={current.anatomyImg}
                alt={`${current.name} Anatomy`}
              />
            </div>
          )}

          {activeSection === "movement" && (
            <div className="movement">
              <h2 className="movement-title">{current.name} Movement</h2>
              <img
                className="movement-img"
                src={current.exerciseImg}
                alt={`${current.name} Movement`}
              />
            </div>
          )}

          {activeSection === "exercises" && (
            <div className="exercises">
              <GroupedExercises groupedData={[{ exercises }]} />
            </div>
          )}
        </div>

        <div className="sections">
          {sections.map((section) => (
            <div
              key={section}
              className={`section ${activeSection === section ? "active" : ""}`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Exercise() {
  const location = useLocation();
  const group = location.state?.group;

  if (!group) {
    return <div>No exercise group selected</div>;
  }

  const flatExercises = group.exercises;

  return (
    <WorkoutProvider exercises={flatExercises} title={group.title}>
      <ExerciseLayout groupTitle={group.title} />
    </WorkoutProvider>
  );
}
