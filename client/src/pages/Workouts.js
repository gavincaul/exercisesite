import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupedExercises from "../components/GroupedExercises.tsx";
import {
  getGlobalWorkouts,
  getUser,
  getUserWorkouts,
} from "../components/movementService.js";
import "./Exercise.css";
import NavBar from "../components/NavBar.tsx";

export default function Workouts() {
  const navigate = useNavigate();
  const [openGroupTitle, setOpenGroupTitle] = useState(null);
  const [activeTab, setActiveTab] = useState("my");
  const [globalMovements, setGlobalMovements] = useState([]);
  const [userMovements, setUserMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (user?.id) {
      getUserWorkouts(user.id)
        .then(setUserMovements)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user]);
  useEffect(() => {
    setIsLoading(true);
    setUser(getUser());
    getGlobalWorkouts()
      .then(setGlobalMovements)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const displayedData = activeTab === "my" ? userMovements : globalMovements;

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
            {activeTab === "global" ? null : user ? (
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
            ) : (
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#555",
                    marginBottom: "0.5rem",
                  }}
                >
                  Log in to access your saved workouts.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Log In / Sign Up
                </button>
              </div>
            )}
          </div>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "4px solid #ccc",
                  borderTop: "4px solid #28a745",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto",
                }}
              />
              <p style={{ marginTop: "1rem", color: "#666" }}>
                Loading workouts...
              </p>
            </div>
          ) : displayedData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No workouts available.
            </p>
          ) : (
            displayedData.map((group) => (
              <div key={group.routine_id} className="group">
                <button
                  className={`section ${
                    openGroupTitle === group.routine_id ? "active" : ""
                  }`}
                  onClick={() => toggleGroup(group.routine_id)}
                >
                  {group.routine_name}
                </button>

                {openGroupTitle === group.routine_id && (
                  <>
                    <GroupedExercises groupedData={group} />
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
                        Start
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
