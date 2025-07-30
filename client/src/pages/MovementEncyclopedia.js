import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar.tsx";
import FlipCard from "../components/Flipcard.tsx";
import "./Encyclopedia.css";
import {
  getAllMovements,
  getAllMuscles,
} from "../components/movementService.js";
export default function MovementEncyclopedia() {
  const [movements, setMovements] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState({});
  const [muscles, setMuscles] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [query, setQuery] = useState("");
 
  const [filters, setFilters] = useState({
    workout: true,
    stretch: true,
    trigger_point: true,
    muscles: false,
  });
  /*const [MGFilters, setMGFilters] = useState({
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
  });*/
  const workoutFilter = {
    workout: 3,
    stretch: 2,
    trigger_point: 1,
  };
  useEffect(() => {
    getAllMuscles()
      .then((data) => {
        const dict = data.reduce((acc, muscle) => {
          acc[muscle.id] = muscle.name;
          return acc;
        }, {});

        setMuscles(dict);
        const namedict = data.reduce((acc, muscle) => {
          acc[muscle.name] = muscle.muscle_group;
          return acc;
        }, {});

        setMuscleGroups(namedict);
      })
      .catch(console.error);

    getAllMovements().then(setMovements).catch(console.error);
  }, []);

  useEffect(() => {
    setMovements((prev) => [...prev]);
  }, [flipped]);

  const filtered = movements
    .filter(
      (m) =>
        (m.name.toLowerCase().includes(query.toLowerCase()) ||
      (filters["muscles"] && m.movement_muscles.some(
            (mm) =>
              muscles[mm.muscle_id]
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              muscleGroups[muscles[mm.muscle_id]]
                .toLowerCase()
                .includes(query.toLowerCase())
          ))) &&
        m.type &&
        filters[m.type]
    )
    .sort((a, b) => {
      if (workoutFilter[a.type] < workoutFilter[b.type]) return 1;
      if (workoutFilter[a.type] > workoutFilter[b.type]) return -1;
      return 0;
    });

  const handleCheckboxChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
/*   const handleMGCheckboxChange = (type) => {
    setMGFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }; */

  return (
    <div className="background">
      <NavBar />
      <div style={{marginTop: "2rem"}}></div>
      <div className="title">Movement Encyclopedia</div>

      <div className="centerconsole">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movements..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              marginTop: "20px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />

          <label style={{ marginTop: "30px" }}>
            <input
              type="checkbox"
              checked={flipped}
              onChange={() => setFlipped(!flipped)}
            />{" "}
            Flip
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",

            marginBottom: "30px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={filters.workout}
              onChange={() => handleCheckboxChange("workout")}
            />
            Workouts
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.stretch}
              onChange={() => handleCheckboxChange("stretch")}
            />
            Stretches
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.trigger_point}
              onChange={() => handleCheckboxChange("trigger_point")}
            />
            Trigger Points
          </label>
          <label
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <input
              type="checkbox"
              checked={filters.muscles}
              onChange={() => handleCheckboxChange("muscles")}
            />
            Include Used Muscles
          </label>
        </div>
        <hr style={{ width: "90%" }} /> {/* This adds a horizontal line */}
        <>
          {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",

            marginBottom: "30px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={MGFilters.arm}
              onChange={() => handleMGCheckboxChange("arm")}
            />
            Arm
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.back}
              onChange={() => handleMGCheckboxChange("back")}
            />
            Back
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.chest}
              onChange={() => handleMGCheckboxChange("chest")}
            />
            Chest
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.core}
              onChange={() => handleMGCheckboxChange("core")}
            />
            Core
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.etc}
              onChange={() => handleMGCheckboxChange("etc")}
            />
            ETC
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.foot}
              onChange={() => handleMGCheckboxChange("foot")}
            />
            Foot
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.hand}
              onChange={() => handleMGCheckboxChange("hand")}
            />
            Hand
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.leg}
              onChange={() => handleMGCheckboxChange("leg")}
            />
            Leg
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.neck}
              onChange={() => handleMGCheckboxChange("neck")}
            />
            Neck
          </label>
          <label>
            <input
              type="checkbox"
              checked={MGFilters.shoulder}
              onChange={() => handleMGCheckboxChange("shoulder")}
            />
            Shoulder
          </label>

          
        </div> */}
        </>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <div className="movement-grid">
            {filtered.map((movement) => (
              <FlipCard
                flippedState={flipped}
                key={movement.id}
                movement={movement}
                muscles={muscles}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
