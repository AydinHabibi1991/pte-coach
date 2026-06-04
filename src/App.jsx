import { useState } from "react";
import PTECoach from "./components/PTECoach"; 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("pte_authorized") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // It checks Vercel for the password. If testing locally, password is "1234"
    const securePassword = import.meta.env.VITE_PASSWORD || "1234";

    if (passwordInput === securePassword) {
      localStorage.setItem("pte_authorized", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "system-ui, sans-serif" }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "320px", textAlign: "center" }}>
          <h2>🔒 Private Site</h2>
          <p style={{ fontSize: "13px", color: "#666" }}>Enter password to use the PTE Coach.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
          {error && <p style={{ color: "red", fontSize: "12px", margin: "0 0 10px 0" }}>{error}</p>}
          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <PTECoach />;
}