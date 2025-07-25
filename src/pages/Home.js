import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import groupedData from "../data/workouts.json";
import GroupedExercises from "../components/GroupedExercises.tsx";
import "./Exercise.css";

export default function Home() {
  const navigate = useNavigate();
  const [openGroupTitle, setOpenGroupTitle] = useState(null);

  const toggleGroup = (title) => {
    setOpenGroupTitle((prev) => (prev === title ? null : title));
  };

  return (
    <div className="background">
      <div className="centerconsole">
        <div className="title">Choose Your Workout</div>
        <div className="main-content scrolling">
          {groupedData.map((group) => (
            <div key={group.title} className="group">
              <button
                className={`section ${openGroupTitle === group.title ? "active" : ""}`}
                onClick={() => toggleGroup(group.title)}
              >
                {group.title}
              </button>

              {openGroupTitle === group.title && (
                <>
                  <GroupedExercises groupedData={[group]} />
                  <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <button
                      onClick={() =>
                        navigate("/exercise", {
                          state: { group },
                        })
                      }
                      className="section"
                      style={{
                        width: "fit-content",
                        padding: "0.5rem 1rem",
                        marginTop: "1rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                    >
                      Start {group.title}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
