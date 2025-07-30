import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar.tsx";
import FlipCard from "../components/Flipcard.tsx";
import "./Encyclopedia.css";
import { getAllMuscles } from "../components/movementService.js";

export default function MusclesEncyclopedia() {
  const [muscles, setMuscles] = useState([]); // store as array for easy filtering
  const [query, setQuery] = useState("");
  const [flipped, setFlipped] = useState(false);

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

  useEffect(() => {
    getAllMuscles()
      .then((data) => setMuscles(data))
      .catch(console.error);
  }, []);

  // ✅ filtering by name + group checkbox
  const filtered = muscles
    .filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const group = m.muscle_group?.toLowerCase();
      const groupChecked = MGFilters[group] ?? false;
      return matchesQuery && groupChecked;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // ✅ alphabetic sort

  const handleMGCheckboxChange = (group) => {
    setMGFilters((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div className="background">
      <NavBar />
      <div style={{ marginTop: "2rem" }}></div>
      <div className="title">Muscle Encyclopedia</div>

      <div className="centerconsole">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search muscles..."
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
              onChange={() => setFlipped((prev) => !prev)}
            />{" "}
            Flip
          </label>
        </div>

        <hr style={{ width: "90%" }} />


        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {Object.keys(MGFilters).map((group) => (
            <label key={group}>
              <input
                type="checkbox"
                checked={MGFilters[group]}
                onChange={() => handleMGCheckboxChange(group)}
              />
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </label>
          ))}
        </div>

        {/* ✅ Grid of FlipCards */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <div className="movement-grid">
            {filtered.map((muscle) => (
              <FlipCard
                key={muscle.id}
                flippedState={flipped}
                movement={{
                  id: muscle.id,
                  name: muscle.name,
                  type: muscle.muscle_group,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
