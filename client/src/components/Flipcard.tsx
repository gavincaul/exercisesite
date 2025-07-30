import React, { useState, useEffect } from "react";
import "./Flipcard.css";

export default function FlipCard({ flippedState, movement, muscles, m }) {
  const [flipped, setFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setFlipped(flippedState);
  }, [flippedState]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const getMusclesByRole = (role) => {
    if (!movement.movement_muscles) return [];
    return movement.movement_muscles
      .filter((mm) => mm.role === role)
      .map((mm) => muscles[mm.muscle_id])
      .filter(Boolean);
  };

  return (
    <>
      <div className="movement-card-container">
        <div
          className={`movement-card ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped(!flipped)}
        >
          <button
            className="overlay-button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            aria-label="Show full exercise details"
          >
            ⓘ
          </button>

          <div className="movement-card-front">
            <img
              src={`/anatomy/${movement.name
                .replace(/\s*[-–]\s*/g, "-")
                .replace(/\s+/g, "_")}.jpg`}
              alt={movement.name}
              style={{
                width: "100%",
                height: "60%",
                borderRadius: "12px 12px 0 0",
                objectFit: "cover",
              }}
            />
            <div className="cardTitle">{movement.name}</div>
          </div>

          {/* Back side with scrollable muscle groups */}
          <div className="movement-card-back">
            <div className="cardTitle">{movement.name}</div>
            <p>
              <strong>{m ? "Type:" : "Group:"}</strong> {movement.type}
            </p>
            <p>
              {m ? (
                <>
                  <strong>Equipment:</strong> {movement.equipment || "None"}
                </>
              ) : (
                ""
              )}
            </p>

            <div className="muscle-groups-scroll">
              {["primary", "secondary", "tertiary"].map((role) => {
                const musclesByRole = getMusclesByRole(role);
                if (musclesByRole.length === 0) return null;
                return (
                  <div key={role} style={{ marginTop: "10px" }}>
                    <div style={{ textAlign: "center", fontWeight: "bold" }}>
                      <hr /> {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                      Muscles: <hr />
                    </div>
                    <ul style={{ marginTop: "5px", paddingLeft: "18px" }}>
                      {musclesByRole.map((name, i) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal overlay */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2>{movement.name}</h2>
            <img
              src={`/anatomy/${movement.name
                .replace(/\s*[-–]\s*/g, "-")
                .replace(/\s+/g, "_")}.jpg`}
              alt={movement.name}
              className="modal-image"
            />

            <p>
              <strong>{m ? "Type:" : "Group:"}</strong> {movement.type}
            </p>
            <p>
              {m ? (
                <>
                  <strong>Equipment:</strong> {movement.equipment || "None"}
                </>
              ) : (
                ""
              )}
            </p>

            {/* Muscle groups in modal */}
            {["primary", "secondary", "tertiary"].map((role) => {
              const musclesByRole = getMusclesByRole(role);
              if (musclesByRole.length === 0) return null;
              return (
                <div key={role} style={{ marginTop: "10px" }}>
                  <strong>
                    {role.charAt(0).toUpperCase() + role.slice(1)} Muscles:
                  </strong>
                  <ul style={{ marginTop: "5px", paddingLeft: "18px" }}>
                    {musclesByRole.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
