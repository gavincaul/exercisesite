import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Exercise.css";
import NavBar from "../components/NavBar.tsx";
import Countdown from "../components/Countdown.tsx";
import GroupedExercisesOnly from "../components/GroupedExercisesOnly.tsx";
import { WorkoutProvider, useWorkout } from "../components/WorkoutProvider.tsx";
import { useNavigate } from "react-router-dom";

function ExerciseLayout() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("timer");
  const [selectedRole, setSelectedRole] = useState("primary");
  const sections = ["timer", "anatomy", "movement", "exercises"];
  const { current, title, exercises, done } = useWorkout();
  const muscleRoles = Array.from(new Set(current.muscles?.map((m) => m.role)));

  if (done) {
    return (
      <div className="background">
        <div
          className="centerconsole"
          style={{ textAlign: "center", padding: "2rem" }}
        >
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
      <NavBar />
      <div style={{ marginTop: "2rem" }}></div>
      <div className="title">{title}</div>

      <div className="centerconsole">
        <div
          className={`main-content ${
            activeSection === "exercises" ? "scrolling" : "centered"
          }`}
        >
          {activeSection === "timer" && <Countdown />}

          {activeSection === "anatomy" && (
            <div className="anatomy">
              <h2 className="anatomy-title">{current.name} Anatomy</h2>

              {/* Taskbar */}
              <div className="muscle-role-taskbar">
                {muscleRoles.map((role) => (
                  <button
                    key={role}
                    className={`muscle-role-button ${
                      selectedRole === role ? "selected" : ""
                    }`}
                    onClick={() => setSelectedRole(role)}
                    style={{
                      width: `${100 / muscleRoles.length}%`, // Distribute evenly
                      padding: "0.5rem",
                      fontSize: "1rem",
                      border: "none",
                      borderBottom:
                        selectedRole === role
                          ? "3px solid #007bff"
                          : "1px solid #ccc",
                      background: selectedRole === role ? "#f0f8ff" : "#f9f9f9",
                      cursor: "pointer",
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>

              <div className="muscle-img-container">
                {current.muscles
                  .filter((m) => m.role === selectedRole)
                  .map((m) => (
                    <div className="muscle-img-wrapper" key={m.muscle_id}>
                      <div className="muscle-name">{m.muscle_name}</div>
                      <img
                        className="muscle-img"
                        src={`${process.env.PUBLIC_URL}/anatomy/${m.muscle_name.replace(
                          /\s+/g,
                          "_"
                        )}.jpg`}
                        alt={m.muscle_name}
                      />
                      <hr style={{width: "100%"}}></hr>
                    </div>
                  ))}
              </div>
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
              <GroupedExercisesOnly groupedData={{ exercises }} />
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

  const flatExercises = group.exercises.map((ex) => ({
    ...ex,
    name: ex.movement_name || `Exercise #${ex.exercise_id}`,
    anatomyImg: `${process.env.PUBLIC_URL}/anatomy/${(ex.movement_name || "")
      .replace(/\s*[-–]\s*/g, "-")
      .replace(/\s+/g, "_")}.jpg`,
    exerciseImg: `${process.env.PUBLIC_URL}/anatomy/${(ex.movement_name || "")
      .replace(/\s*[-–]\s*/g, "-")
      .replace(/\s+/g, "_")}.jpg`,
  }));

  return (
    <WorkoutProvider exercises={flatExercises} title={group.routine_name}>
      <ExerciseLayout groupTitle={group.routine_name} />
    </WorkoutProvider>
  );
}
