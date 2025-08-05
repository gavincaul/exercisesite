import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../components/movementService.js";
import NavBar from "../components/NavBar.tsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // User state from localStorage
  const [user, setUser] = useState(null);

  // On mount, load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        if (!inviteCode.trim()) {
          setError("Invite code is required for signup.");
          setLoading(false);
          return;
        }
        await signup(email, password, inviteCode);
        alert("Signup successful! Please log in.");
        setIsSignup(false);
      } else {
        const data = await login(email, password);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("session", JSON.stringify(data.session));
        setUser(data.user);
        navigate("/workouts");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    setUser(null);
    setEmail("");
    setPassword("");
    setInviteCode("");
    setIsSignup(false);
    navigate("/login");
  };

  return (
    <div className="background">
      <NavBar />
      <div className="centerconsole" >
        {user ? (
          <>
            <h2 style={{ textAlign: "center" }}>
              You are signed in, {user.email || user.user_metadata?.full_name || "User"}!
            </h2>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                onClick={handleSignOut}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ textAlign: "center" }}>
              {isSignup ? "Sign Up" : "Log In"}
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                style={{ width: "60%", margin: "auto" }}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                style={{ width: "60%", margin: "auto" }}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              {isSignup && (
                <input
                  type="text"
                  placeholder="Invite Code"
                  value={inviteCode}
                  style={{ width: "60%", margin: "auto" }}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required={isSignup}
                />
              )}
              {error && (
                <p style={{ margin: "auto", color: "red", fontWeight: "bold" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  width: "60%",
                  margin: "auto",
                }}
              >
                {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
              </button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center" }}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => {
                  setError(null);
                  setIsSignup(!isSignup);
                }}
                style={{
                  color: "#007bff",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
