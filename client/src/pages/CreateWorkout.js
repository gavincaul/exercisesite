import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar.tsx";
import FlipCard from "../components/Flipcard.tsx";
import "./Exercise.css";
import { getRoutineNums, getAllMuscles, getAllMovements } from "../components/movementService.js";

export default function CreateWorkout() {
  const [step, setStep] = useState(1);
  const [workoutData, setWorkoutData] = useState({
    id: null,
    name: "",
    description: "",
  });

  // Mini Encyclopedia states
  const [muscles, setMuscles] = useState([]);
  const [movements, setMovements] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState({});
  const [muscleDict, setMuscleDict] = useState({});
  
  // Search and filter states
  const [muscleQuery, setMuscleQuery] = useState("");
  const [movementQuery, setMovementQuery] = useState("");
  const [muscleFlipped, setMuscleFlipped] = useState(false);
  const [movementFlipped, setMovementFlipped] = useState(false);
  
  // Muscle filters
  const [MGFilters, setMGFilters] = useState({
    arm: true,
    back: true,
    chest: true,
    core: true,
    etc: true,
    foot: true,
    hand: true,
    leg: true,
    neck: true,
    shoulder: true,
  });
  
  // Movement filters
  const [movementFilters, setMovementFilters] = useState({
    workout: true,
    stretch: true,
    trigger_point: true,
    muscles: false,
  });
  
  // Exercise input fields
  const [exerciseForm, setExerciseForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    time: "",
    rest: "",
    description: ""
  });
  
  // Added workouts storage
  const [addedWorkouts, setAddedWorkouts] = useState([]);

  useEffect(() => {
    getRoutineNums()
      .then((data) => {
        const ids = data.map((r) => r.id);
        const newId = ids.length ? Math.max(...ids) + 1 : 1;
        setWorkoutData((prev) => ({ ...prev, id: newId }));
      })
      .catch(console.error);
      
    // Load muscles data
    getAllMuscles()
      .then((data) => {
        setMuscles(data);
        const dict = data.reduce((acc, muscle) => {
          acc[muscle.id] = muscle.name;
          return acc;
        }, {});
        setMuscleDict(dict);
        
        const namedict = data.reduce((acc, muscle) => {
          acc[muscle.name] = muscle.muscle_group;
          return acc;
        }, {});
        setMuscleGroups(namedict);
      })
      .catch(console.error);
      
    // Load movements data
    getAllMovements()
      .then(setMovements)
      .catch(console.error);
  }, []);

  const handleNext = () => {
    if (step === 1 && !workoutData.name.trim()) {
      alert("Please enter a routine name before proceeding.");
      return;
    }
    setStep((prev) => prev + 1);
  };
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
  };
  
  const handleExerciseFormChange = (e) => {
    setExerciseForm({ ...exerciseForm, [e.target.name]: e.target.value });
  };
  
  const handleAddWorkout = () => {
    if (exerciseForm.exercise.trim()) {
      // Find the movement in the encyclopedia
      const foundMovement = movements.find(movement => 
        movement.name.toLowerCase() === exerciseForm.exercise.toLowerCase()
      );
      
      if (!foundMovement) {
        alert("Exercise name must be selected from the Movement Encyclopedia. Please choose a valid exercise.");
        return;
      }
      
      // Check if this movement is already added
      const alreadyAdded = addedWorkouts.find(workout => workout.id === foundMovement.id);
      if (alreadyAdded) {
        alert("This exercise has already been added to the routine.");
        return;
      }
      
      const newWorkout = {
        id: foundMovement.id, // Use the movement's ID from encyclopedia
        movement_id: foundMovement.id, // Also store as movement_id for backend
        ...exerciseForm
      };
      setAddedWorkouts(prev => [...prev, newWorkout]);
      // Clear the form
      setExerciseForm({
        exercise: "",
        sets: "",
        reps: "",
        time: "",
        rest: "",
        description: ""
      });
    }
  };
  
  const handleDeleteWorkout = (id) => {
    setAddedWorkouts(prev => prev.filter(workout => workout.id !== id));
  };
  

  
  const handleFinishRoutine = () => {
    if (!workoutData.name.trim()) {
      alert("Please enter a routine name before finishing.");
      return;
    }
    setStep(3); // Move to final step
  };
  
  const handleMGCheckboxChange = (group) => {
    setMGFilters((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };
  
  const handleMovementCheckboxChange = (type) => {
    setMovementFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  
  // Filter muscles
  const filteredMuscles = muscles
    .filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(muscleQuery.toLowerCase());
      const group = m.muscle_group?.toLowerCase();
      const groupChecked = MGFilters[group] ?? false;
      return matchesQuery && groupChecked;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
    
  // Filter movements
  const workoutFilter = {
    workout: 3,
    stretch: 2,
    trigger_point: 1,
  };
  
  const filteredMovements = movements
    .filter(
      (m) =>
        (m.name.toLowerCase().includes(movementQuery.toLowerCase()) ||
      (movementFilters["muscles"] && m.movement_muscles.some(
            (mm) =>
              muscleDict[mm.muscle_id]
                .toLowerCase()
                .includes(movementQuery.toLowerCase()) ||
              muscleGroups[muscleDict[mm.muscle_id]]
                .toLowerCase()
                .includes(movementQuery.toLowerCase())
          ))) &&
        m.type &&
        movementFilters[m.type]
    )
    .sort((a, b) => {
      if (workoutFilter[a.type] < workoutFilter[b.type]) return 1;
      if (workoutFilter[a.type] > workoutFilter[b.type]) return -1;
      return 0;
    });

  return (
    <div className="background">
      <NavBar />
      <div style={{ marginTop: "2rem" }}></div>
      <div className="title">Create Routine</div>

      <div className="centerconsole" style={{marginBottom: "2rem"}}>
        <div className="main-content scrolling">
          {step === 1 && (
            <div
              style={{
                backgroundColor: "white",
                border: "1.5px solid rgb(183, 183, 184)",
                borderRadius: "10px",
                padding: "2rem",
                width: "90%",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <h2 style={{ marginBottom: "1rem" }}>Step 1: Routine Details</h2>

              <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                <label style={{ display: "block", fontWeight: 600 }}>
                  Routine Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={workoutData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                <label style={{ display: "block", fontWeight: 600 }}>
                  Description:
                </label>
                <textarea
                  name="description"
                  value={workoutData.description}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    minHeight: "80px",
                  }}
                />
              </div>

              <p style={{ marginBottom: "1rem" }}>
                Generated ID: <strong>{workoutData.id}</strong>
              </p>

              <button
                onClick={handleNext}
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
                Next →
              </button>
            </div>
          )}

          {step > 1 && (
            <>
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  onClick={handlePrev}
                  className="section"
                  style={{
                    width: "fit-content",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                >
                  ← Back
                </button>
              </div>
              <div className="workouts">
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Step 2: Add Workouts</h2>
                
                {/* Exercise Input Fields */}
                <div style={{
                  backgroundColor: "white",
                  border: "1.5px solid rgb(183, 183, 184)",
                  borderRadius: "10px",
                  padding: "1.5rem",
                  margin: "0 auto 2rem auto",
                  width: "90%"
                }}>
                  <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>Exercise Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Exercise *</label>
                      <input
                        type="text"
                        name="exercise"
                        value={exerciseForm.exercise}
                        onChange={handleExerciseFormChange}
                        placeholder="Choose from Movement Encyclopedia"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Sets</label>
                      <input
                        type="number"
                        name="sets"
                        value={exerciseForm.sets}
                        onChange={handleExerciseFormChange}
                        placeholder="e.g., 3"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Reps</label>
                      <input
                        type="number"
                        name="reps"
                        value={exerciseForm.reps}
                        onChange={handleExerciseFormChange}
                        placeholder="e.g., 12"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Time</label>
                      <input
                        type="text"
                        name="time"
                        value={exerciseForm.time}
                        onChange={handleExerciseFormChange}
                        placeholder="e.g., 30s"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Rest</label>
                      <input
                        type="text"
                        name="rest"
                        value={exerciseForm.rest}
                        onChange={handleExerciseFormChange}
                        placeholder="e.g., 60s"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Description</label>
                      <textarea
                        name="description"
                        value={exerciseForm.description}
                        onChange={handleExerciseFormChange}
                        placeholder="Optional exercise notes..."
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          minHeight: "60px",
                          resize: "vertical"
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Add Workout Button - Only show if exercise is filled */}
                  {exerciseForm.exercise.trim() && (
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <button
                        onClick={handleAddWorkout}
                        style={{
                          padding: "0.75rem 1.5rem",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Add Workout
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Two-Column Encyclopedia Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  width: "95%",
                  margin: "0 auto"
                }}>
                  
                  {/* Muscles Encyclopedia Column */}
                  <div style={{
                    backgroundColor: "white",
                    border: "1.5px solid rgb(183, 183, 184)",
                    borderRadius: "10px",
                    padding: "1rem",
                    height: "600px",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Muscles Encyclopedia</h3>
                    
                    {/* Muscle Search Bar */}
                    <div style={{ marginBottom: "1rem" }}>
                      <input
                        type="text"
                        placeholder="Search muscles..."
                        value={muscleQuery}
                        onChange={(e) => setMuscleQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          fontSize: "14px",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          marginBottom: "8px"
                        }}
                      />
                      <label style={{ fontSize: "14px" }}>
                        <input
                          type="checkbox"
                          checked={muscleFlipped}
                          onChange={() => setMuscleFlipped(prev => !prev)}
                        />{" "}
                        Flip
                      </label>
                    </div>
                    
                    {/* Muscle Group Filters */}
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "1rem",
                      fontSize: "12px"
                    }}>
                      {Object.keys(MGFilters).map((group) => (
                        <label key={group} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <input
                            type="checkbox"
                            checked={MGFilters[group]}
                            onChange={() => handleMGCheckboxChange(group)}
                          />
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </label>
                      ))}
                    </div>
                    
                    <hr style={{ margin: "0 0 1rem 0" }} />
                    
                    {/* Scrollable Muscle Cards */}
                    <div style={{
                      flex: 1,
                      overflowY: "auto",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      justifyContent: "center",
                      alignContent: "flex-start"
                    }}>
                      {filteredMuscles.map((muscle) => (
                        <div key={muscle.id} style={{ transform: "scale(0.8)", transformOrigin: "top" }}>
                          <FlipCard
                            flippedState={muscleFlipped}
                            movement={{
                              id: muscle.id,
                              name: muscle.name,
                              type: muscle.muscle_group,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Movement Encyclopedia Column */}
                  <div style={{
                    backgroundColor: "white",
                    border: "1.5px solid rgb(183, 183, 184)",
                    borderRadius: "10px",
                    padding: "1rem",
                    height: "600px",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Movement Encyclopedia</h3>
                    
                    {/* Movement Search Bar */}
                    <div style={{ marginBottom: "1rem" }}>
                      <input
                        type="text"
                        placeholder="Search movements..."
                        value={movementQuery}
                        onChange={(e) => setMovementQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          fontSize: "14px",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          marginBottom: "8px"
                        }}
                      />
                      <label style={{ fontSize: "14px" }}>
                        <input
                          type="checkbox"
                          checked={movementFlipped}
                          onChange={() => setMovementFlipped(prev => !prev)}
                        />{" "}
                        Flip
                      </label>
                    </div>
                    
                    {/* Movement Type Filters */}
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "1rem",
                      fontSize: "12px"
                    }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="checkbox"
                          checked={movementFilters.workout}
                          onChange={() => handleMovementCheckboxChange("workout")}
                        />
                        Workouts
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="checkbox"
                          checked={movementFilters.stretch}
                          onChange={() => handleMovementCheckboxChange("stretch")}
                        />
                        Stretches
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="checkbox"
                          checked={movementFilters.trigger_point}
                          onChange={() => handleMovementCheckboxChange("trigger_point")}
                        />
                        Trigger Points
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="checkbox"
                          checked={movementFilters.muscles}
                          onChange={() => handleMovementCheckboxChange("muscles")}
                        />
                        Include Used Muscles
                      </label>
                    </div>
                    
                    <hr style={{ margin: "0 0 1rem 0" }} />
                    
                    {/* Scrollable Movement Cards */}
                    <div style={{
                      flex: 1,
                      overflowY: "auto",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      justifyContent: "center",
                      alignContent: "flex-start"
                    }}>
                      {filteredMovements.map((movement) => (
                        <div 
                          key={movement.id} 
                          style={{ 
                            transform: "scale(0.8)", 
                            transformOrigin: "top",
                            cursor: "pointer"
                          }}
                          onClick={() => setExerciseForm(prev => ({ ...prev, exercise: movement.name }))}
                        >
                          <FlipCard
                            flippedState={movementFlipped}
                            movement={movement}
                            muscles={muscleDict}
                            m={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
                
                {/* Added Workouts Display */}
                {addedWorkouts.length > 0 && (
                  <div style={{
                    backgroundColor: "white",
                    border: "1.5px solid rgb(183, 183, 184)",
                    borderRadius: "10px",
                    padding: "1.5rem",
                    margin: "2rem auto 0 auto",
                    width: "90%"
                  }}>
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Added Workouts ({addedWorkouts.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {addedWorkouts.map((workout) => (
                        <div key={workout.id} style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#f8f9fa"
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                              {workout.exercise}
                            </div>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.9rem", color: "#666" }}>
                              {workout.sets && <span><strong>Sets:</strong> {workout.sets}</span>}
                              {workout.reps && <span><strong>Reps:</strong> {workout.reps}</span>}
                              {workout.time && <span><strong>Time:</strong> {workout.time}</span>}
                              {workout.rest && <span><strong>Rest:</strong> {workout.rest}</span>}
                            </div>
                            {workout.description && (
                              <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", fontStyle: "italic" }}>
                                {workout.description}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteWorkout(workout.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              marginLeft: "1rem"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Finish Routine Button - Only show if more than 1 workout */}
                    {addedWorkouts.length > 1 && (
                      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                        <button
                          onClick={handleFinishRoutine}
                          style={{
                            padding: "0.75rem 2rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          Finish Routine →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  onClick={handlePrev}
                  className="section"
                  style={{
                    width: "fit-content",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                >
                  ← Back
                </button>
              </div>
              
              <div style={{
                backgroundColor: "white",
                border: "1.5px solid rgb(183, 183, 184)",
                borderRadius: "10px",
                padding: "2rem",
                width: "90%",
                margin: "2rem auto",
                textAlign: "center"
              }}>
                <h2 style={{ marginBottom: "1rem" }}>Step 3: Review & Submit Routine</h2>
                
                <div style={{ marginBottom: "2rem", textAlign: "left" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Routine Details:</h3>
                  <p><strong>Name:</strong> {workoutData.name}</p>
                  <p><strong>Description:</strong> {workoutData.description}</p>
                  <p><strong>ID:</strong> {workoutData.id}</p>
                </div>
                
                <div style={{ marginBottom: "2rem", textAlign: "left" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Workouts ({addedWorkouts.length}):</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {addedWorkouts.map((workout, index) => (
                      <div key={workout.id} style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "1rem",
                        backgroundColor: "#f8f9fa"
                      }}>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                          {index + 1}. {workout.exercise}
                        </div>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.9rem", color: "#666" }}>
                          {workout.sets && <span><strong>Sets:</strong> {workout.sets}</span>}
                          {workout.reps && <span><strong>Reps:</strong> {workout.reps}</span>}
                          {workout.time && <span><strong>Time:</strong> {workout.time}</span>}
                          {workout.rest && <span><strong>Rest:</strong> {workout.rest}</span>}
                        </div>
                        {workout.description && (
                          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", fontStyle: "italic" }}>
                            <strong>Notes:</strong> {workout.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (!workoutData.name.trim()) {
                      alert("Please enter a routine name before creating.");
                      return;
                    }
                    console.log(workoutData, addedWorkouts);
                    // Here you would typically submit to your backend
                    alert(`Routine "${workoutData.name}" created successfully with ${addedWorkouts.length} workouts!`);
                    // Reset form or redirect
                  }}
                  style={{
                    padding: "1rem 2rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Create Routine
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
