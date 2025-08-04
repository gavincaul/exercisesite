import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ color }) {
  const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div
      className="navcontainer"
    >
      <div
        className={`button`}
        role="button"
        aria-label="Toggle navigation"
        tabIndex={0}
      >
        <nav className="nav">
          <div className="navlinks">
            <NavLink
              to="/"
              className="navlink"
              style={{ animationDelay: "300ms" }}
            >
              {isMobile ? "🏠" : "Home"}
            </NavLink>
            <NavLink
              to="/movement-encyclopedia"
              className="navlink"
              style={{ animationDelay: "400ms" }}
            >
              {isMobile ? "📚" : "Movements"}
            </NavLink>
            <NavLink
              to="/muscles-encyclopedia"
              className="navlink"
              style={{ animationDelay: "500ms" }}
            >
              {isMobile ? "📚" : "Muscles"}
            </NavLink>
            {/*<NavLink
              to="/about"
              className="navlink"
              style={{ animationDelay: "600ms" }}
            >
              {isMobile ? "📄" : "About"}
            </NavLink>*/}
            <NavLink
              to="/login"
              className="navlink"
              style={{ animationDelay: "700ms" }}
            >
              {isMobile ? "A" : "Account"}
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
