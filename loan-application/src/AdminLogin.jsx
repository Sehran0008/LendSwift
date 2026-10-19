
import React, { useState } from "react";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || "Login failed");
}

if (!data.token) {
  throw new Error("Login response mein token nahi mila.");
}

onLogin(data.token);

    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Backend connect nahi ho raha. Check karein ki server chal raha hai."
          : err.message || "Login failed. Dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "35px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "36px",
            color: "#3156d9",
          }}
        >
          ◈
        </div>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "8px",
            color: "#172033",
          }}
        >
          LendSwift
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "28px",
          }}
        >
          Admin Login
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            autoComplete="username"
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "18px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p
              role="alert"
              style={{ color: "#dc2626", fontSize: "14px" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#94a3b8" : "#3156d9",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <p
          style={{
            marginTop: "22px",
            color: "#64748b",
            fontSize: "12px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Admin credentials are verified by the backend.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
