import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupedExercises from "../components/GroupedExercises.tsx";
import { getGlobalWorkouts } from "../components/movementService.js";
import "./Exercise.css";
import NavBar from "../components/NavBar.tsx";

export default function Workouts() {
  const navigate = useNavigate();
  const [openGroupTitle, setOpenGroupTitle] = useState(null);
  const [activeTab, setActiveTab] = useState("my");
  const [movements, setMovements] = useState([]);

  const myWorkouts = [
    {
      title: "My Upper Body",
      exercises: [
        { id: 1, name: "Push-up" },
        { id: 2, name: "Pull-up" },
      ],
    },
  ];

  useEffect(() => {
    getGlobalWorkouts().then(setMovements).catch(console.error);
  }, []);
  console.log(movements);

  const displayedData = activeTab === "my" ? myWorkouts : movements;

  const toggleGroup = (title) => {
    setOpenGroupTitle((prev) => (prev === title ? null : title));
  };

  return (
    <div className="background">
      <NavBar />
      <div style={{ marginTop: "2rem" }}></div>
      <div className="title">Choose Your Exercise</div>
      <div className="centerconsole">
        <div
          style={{
            display: "flex",
            border: "1.5px solid rgb(183, 183, 184)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "2rem",
            userSelect: "none",
          }}
        >
          <div
            onClick={() => {
              setActiveTab("my");
              setOpenGroupTitle(null);
            }}
            role="tab"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab("my");
                setOpenGroupTitle(null);
              }
            }}
            aria-selected={activeTab === "my"}
            style={{
              flex: 1,
              padding: "1rem 0",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: activeTab === "my" ? "gray" : "white",
              color: activeTab === "my" ? "white" : "gray",
              fontWeight: "600",
              fontSize: "1.2rem",
              borderRight: "1.5px solid rgb(0, 0, 0)",
              transition: "background-color 0.3s ease",
            }}
          >
            My Workouts
          </div>
          <div
            onClick={() => {
              setActiveTab("global");
              setOpenGroupTitle(null);
            }}
            role="tab"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab("global");
                setOpenGroupTitle(null);
              }
            }}
            aria-selected={activeTab === "global"}
            style={{
              flex: 1,
              padding: "1rem 0",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: activeTab === "my" ? "white" : "gray",
              color: activeTab === "my" ? "gray" : "white",
              fontWeight: "600",
              fontSize: "1.2rem",
              transition: "background-color 0.3s ease",
            }}
          >
            Global Workouts
          </div>
        </div>

        <div className="main-content scrolling">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              onClick={() => navigate("/create-workout")}
              className="section"
              style={{
                width: "fit-content",
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              Create a Workout
            </button>
          </div>
          {displayedData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No workouts available.
            </p>
          ) : (
            displayedData.map((group) => (
              <div key={group.title} className="group">
                <button
                  className={`section ${
                    openGroupTitle === group.title ? "active" : ""
                  }`}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
