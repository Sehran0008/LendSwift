
import React, { useEffect, useState } from "react";

function AdminDashboard({ token }) {
  console.log("Admin token available:", Boolean(token));
  const [applicationList, setApplicationList] = useState([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Load applications from MongoDB through the Express backend.
  async function loadApplications() {
    setIsLoadingApplications(true);
    setLoadError("");

    
try {
  const response = await fetch(
   `${import.meta.env.VITE_API_URL}/api/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Could not load applications."
    );
  }


      if (!Array.isArray(result)) {
        throw new Error("The server returned an unexpected applications response.");
      }

      const normalizedApplications = result.map((app) => {
        const databaseId = app.id || app._id;
        return {
          ...app,
          // Use the same short display ID format as the application success page.
          id: app.displayId || (databaseId ? "LS-" + String(databaseId).slice(-6) : "—"),
          databaseId: databaseId ? String(databaseId) : "",
          status: app.status || "Pending",
          submittedAt: app.submittedAt || app.createdAt || app.updatedAt || "",
        };
      });

      setApplicationList(normalizedApplications);
    } catch (error) {
      console.error("Could not load MongoDB applications:", error);
      setLoadError(error.message || "Could not connect to the backend.");
    } finally {
      setIsLoadingApplications(false);
    }
  }

  useEffect(() => {
  if (token) {
    loadApplications();
  } else {
    setLoadError("Admin token nahi mila. Dobara login karein.");
    setIsLoadingApplications(false);
  }
}, [token]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Update status in MongoDB, then sync the dashboard with the server.
  async function updateStatus(displayId, newStatus) {
    const appToUpdate = applicationList.find((app) => app.id === displayId);

    if (!appToUpdate?.databaseId) {
      setLoadError("This application is missing its database ID. Refresh and try again.");
      return;
    }

    try {
      setLoadError("");
    
      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/applications/${encodeURIComponent(appToUpdate.databaseId)}/status`,
    {
          method: "PATCH",
          headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
      },
           body: JSON.stringify({ status: newStatus }),
     }
   );

const result = await response.json();

if (!response.ok) {
  throw new Error(
    result.message || "Could not update application status."
  );
}
      await loadApplications();
      setSelectedApplication((current) =>
        current?.databaseId === appToUpdate.databaseId
          ? { ...current, status: newStatus }
          : current
      );
    } catch (error) {
      console.error("Status update failed:", error);
      setLoadError(error.message || "Could not update application status.");
    }
  }

  // Delete the record from MongoDB, not just from the browser UI.
  async function deleteApplication(displayId) {
    const appToDelete = applicationList.find((app) => app.id === displayId);

    if (!appToDelete?.databaseId) {
      setLoadError("This application is missing its database ID. Refresh and try again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this application from MongoDB?"
    );

    if (!confirmDelete) return;

    try {
      setLoadError("");
    
     const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${encodeURIComponent(appToDelete.databaseId)}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete application.");
      }

      setSelectedApplication((current) =>
        current?.databaseId === appToDelete.databaseId ? null : current
      );
      await loadApplications();
    } catch (error) {
      console.error("Application delete failed:", error);
      setLoadError(error.message || "Could not delete application.");
    }
  }

  const filteredApplications = applicationList.filter((app) => {
    const name = String(app.name || "").toLowerCase();
    const id = String(app.id || "").toLowerCase();
    const status = app.status || "Pending";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Applications",
      value: applicationList.length,
      color: "#2563eb",
      icon: "▤",
    },
    {
      title: "Pending",
      value: applicationList.filter(
        (app) => app.status === "Pending"
      ).length,
      color: "#d97706",
      icon: "◷",
    },
    {
      title: "Approved",
      value: applicationList.filter(
        (app) => app.status === "Approved"
      ).length,
      color: "#16a34a",
      icon: "✓",
    },
    {
      title: "Rejected",
      value: applicationList.filter(
        (app) => app.status === "Rejected"
      ).length,
      color: "#dc2626",
      icon: "×",
    },
  ];

  const chartStatusData = [
    {
      label: "Pending",
      count: applicationList.filter((app) => (app.status || "Pending") === "Pending").length,
      color: "#d97706",
    },
    {
      label: "Approved",
      count: applicationList.filter((app) => app.status === "Approved").length,
      color: "#16a34a",
    },
    {
      label: "Rejected",
      count: applicationList.filter((app) => app.status === "Rejected").length,
      color: "#dc2626",
    },
  ];

  const loanTypeCounts = applicationList.reduce((counts, app) => {
    const type = String(app.type || "Other");
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});

  const loanTypeData = Object.entries(loanTypeCounts).map(([label, count], index) => ({
    label,
    count,
    color: ["#3156d9", "#7c3aed", "#0891b2", "#0d9488", "#ea580c"][index % 5],
  }));

  const navItems = [
    { label: "Dashboard", icon: "▦" },
    { label: "Applications", icon: "▤" },
  ];

  const styles = {
    app: {
      display: "flex",
      minHeight: "100vh",
      background: "#f4f7fb",
      color: "#172033",
      fontFamily: "Arial, sans-serif",
    },
    sidebar: {
      width: "235px",
      flexShrink: 0,
      background: "#111c35",
      color: "#fff",
      padding: "25px 15px",
      boxSizing: "border-box",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
      padding: "0 12px",
      marginBottom: "8px",
    },
    logoSub: {
      color: "#9eabc5",
      fontSize: "12px",
      padding: "0 12px",
      marginBottom: "38px",
    },
    navHeading: {
      color: "#8997b5",
      fontSize: "11px",
      letterSpacing: "1.5px",
      padding: "0 12px",
      marginBottom: "12px",
    },
    navButton: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      border: "none",
      padding: "13px 12px",
      marginBottom: "8px",
      borderRadius: "9px",
      textAlign: "left",
      fontSize: "14px",
      cursor: "pointer",
    },
    main: {
      flex: 1,
      minWidth: 0,
      padding: "30px",
      boxSizing: "border-box",
    },
    topbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "30px",
    },
    muted: {
      color: "#778198",
      fontSize: "14px",
    },
    card: {
      background: "#fff",
      padding: "22px",
      borderRadius: "14px",
      border: "1px solid #e8edf5",
      boxShadow: "0 4px 15px rgba(30, 50, 90, 0.04)",
    },
    control: {
      padding: "11px 12px",
      border: "1px solid #dbe2ed",
      borderRadius: "8px",
      background: "#fff",
      fontSize: "13px",
      boxSizing: "border-box",
    },
    th: {
      padding: "15px 13px",
      textAlign: "left",
      color: "#68748b",
      fontSize: "12px",
      fontWeight: "bold",
      borderBottom: "1px solid #e7ecf3",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "15px 13px",
      borderBottom: "1px solid #edf0f5",
      fontSize: "13px",
      whiteSpace: "nowrap",
    },
  };

  const isApplicationsPage = activePage === "Applications";

  return (
    <div style={styles.app}>
      <style>{`
        * { box-sizing: border-box; }
        .ls-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }
        .ls-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 22px;
        }
        .ls-table-wrap { width: 100%; overflow-x: auto; }
        .ls-nav-button:hover { background: #263451 !important; }
        .ls-action-button:hover { opacity: 0.85; }
        @media (max-width: 1000px) {
          .ls-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 850px) {
          .ls-chart-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 650px) {
          .ls-app-layout { flex-direction: column; }
          .ls-sidebar {
            width: 100% !important;
            padding: 18px !important;
          }
          .ls-logo-sub { margin-bottom: 18px !important; }
          .ls-nav-list { display: flex; gap: 8px; }
          .ls-nav-button { width: auto !important; margin: 0 !important; }
          .ls-main { padding: 18px !important; }
          .ls-stat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <aside className="ls-sidebar" style={styles.sidebar}>
        <div style={styles.logo}>◈ LendSwift</div>
        <div className="ls-logo-sub" style={styles.logoSub}>
          LOAN MANAGEMENT
        </div>

        <div style={styles.navHeading}>MAIN MENU</div>

        <nav className="ls-nav-list" style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {navItems.map((item) => {
            const selected = activePage === item.label;

            return (
              <button
                key={item.label}
                className="ls-nav-button"
                onClick={() => setActivePage(item.label)}
                style={{
                  ...styles.navButton,
                  background: selected ? "#3156d9" : "transparent",
                  color: selected ? "#fff" : "#b7c2d8",
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: "40px",
            padding: "15px 12px",
            background: "#1d2a47",
            borderRadius: "10px",
            color: "#b7c2d8",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#fff" }}>MongoDB Connected</strong>
          <br />
          Applications are loaded from the backend database.
        </div>
      </aside>

      <main className="ls-main" style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <h1 style={{ fontSize: "26px", margin: "0 0 8px" }}>
              {isApplicationsPage ? "Applications" : "Dashboard"}
            </h1>
            <p style={{ ...styles.muted, margin: 0 }}>
              Welcome to your LendSwift management panel.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e7ecf3",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#16a34a" }}>●</span> Admin Panel
          </div>
        </header>

        {!isApplicationsPage && (
          <>
            <div className="ls-stat-grid" style={{ marginBottom: "25px" }}>
              {stats.map((stat) => (
                <div key={stat.title} style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ ...styles.muted, fontSize: "13px" }}>
                      {stat.title}
                    </span>

                    <span
                      style={{
                        width: "38px",
                        height: "38px",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "10px",
                        background: `${stat.color}15`,
                        color: stat.color,
                        fontSize: "22px",
                      }}
                    >
                      {stat.icon}
                    </span>
                  </div>

                  <h2 style={{ fontSize: "30px", margin: "18px 0 0" }}>
                    {stat.value}
                  </h2>
                </div>
              ))}
            </div>

            <div
              className="ls-chart-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "22px",
                marginBottom: "22px",
              }}
            >
              <section style={styles.card}>
                <h2 style={{ fontSize: "17px", margin: "0 0 6px" }}>
                  Application Status
                </h2>
                <p style={{ ...styles.muted, fontSize: "12px", margin: "0 0 22px" }}>
                  Current status of all demo applications
                </p>

                {chartStatusData.map((item) => {
                  const total = applicationList.length;
                  const percentage = total ? (item.count / total) * 100 : 0;

                  return (
                    <div key={item.label} style={{ marginBottom: "18px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginBottom: "8px",
                          fontSize: "13px",
                        }}
                      >
                        <span style={{ color: "#334155", fontWeight: 600 }}>
                          {item.label}
                        </span>
                        <span style={{ color: "#64748b" }}>
                          {item.count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          background: "#edf1f7",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background: item.color,
                            borderRadius: "999px",
                            transition: "width 250ms ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {applicationList.length === 0 && (
                  <p style={{ ...styles.muted, margin: "12px 0 0", fontSize: "12px" }}>
                    Submit a demo application to see chart data.
                  </p>
                )}
              </section>

              <section style={styles.card}>
                <h2 style={{ fontSize: "17px", margin: "0 0 6px" }}>
                  Loan Type Breakdown
                </h2>
                <p style={{ ...styles.muted, fontSize: "12px", margin: "0 0 22px" }}>
                  Applications grouped by loan type
                </p>

                {loanTypeData.length > 0 ? (
                  loanTypeData.map((item) => {
                    const total = applicationList.length;
                    const percentage = total ? (item.count / total) * 100 : 0;

                    return (
                      <div key={item.label} style={{ marginBottom: "18px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            marginBottom: "8px",
                            fontSize: "13px",
                          }}
                        >
                          <span style={{ color: "#334155", fontWeight: 600 }}>
                            {item.label}
                          </span>
                          <span style={{ color: "#64748b" }}>
                            {item.count} ({Math.round(percentage)}%)
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                            background: "#edf1f7",
                            borderRadius: "999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: "100%",
                              background: item.color,
                              borderRadius: "999px",
                              transition: "width 250ms ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ ...styles.muted, margin: 0, fontSize: "12px" }}>
                    No loan type data yet. Submit a demo application to get started.
                  </p>
                )}
              </section>
            </div>

            <div style={{ ...styles.card, marginBottom: "22px" }}>
              <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>
                Quick Overview
              </h2>
              <p style={{ ...styles.muted, margin: 0, lineHeight: 1.7 }}>
                Manage loan applications, review their current status, and
                search records from the Applications section.
              </p>
              <button
                className="ls-action-button"
                onClick={() => setActivePage("Applications")}
                style={{
                  marginTop: "18px",
                  padding: "11px 16px",
                  background: "#3156d9",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                View Applications →
              </button>
            </div>
          </>
        )}

        {(isApplicationsPage || !isApplicationsPage) && (
          <section style={styles.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 6px", fontSize: "18px" }}>
                  {isApplicationsPage ? "All Applications" : "Recent Applications"}
                </h2>
                <p style={{ ...styles.muted, margin: 0, fontSize: "12px" }}>
                  {filteredApplications.length} record(s) found · Loaded from MongoDB
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={loadApplications}
                disabled={isLoadingApplications}
                className="ls-action-button"
                style={{ padding: "9px 13px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: isLoadingApplications ? "wait" : "pointer", fontWeight: "bold" }}
              >
                {isLoadingApplications ? "Loading..." : "Refresh Applications"}
              </button>
              {loadError && (
                <span role="alert" style={{ color: "#b91c1c", fontSize: "13px" }}>
                  {loadError} Make sure the backend is running and GET /api/applications exists.
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                placeholder="Search name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...styles.control, flex: "1", minWidth: "200px" }}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...styles.control, minWidth: "150px" }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="ls-table-wrap">
              <table
                style={{
                  width: "100%",
                  minWidth: "850px",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: "#f7f9fc" }}>
                    {[
                      "APPLICATION ID",
                      "APPLICANT",
                      "LOAN TYPE",
                      "AMOUNT",
                      "STATUS",
                      "ACTION",
                    ].map((heading) => (
                      <th key={heading} style={styles.th}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ ...styles.td, color: "#3156d9", fontWeight: "bold" }}>
                        {app.id}
                      </td>

                      <td style={styles.td}>{app.name || "—"}</td>

                      <td style={styles.td}>{app.type || "—"}</td>

                      <td style={{ ...styles.td, fontWeight: "bold" }}>
                        ₹{Number(app.amount || 0).toLocaleString("en-IN")}
                      </td>

                      <td style={styles.td}>
                        <select
                          value={app.status || "Pending"}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          style={{
                            ...styles.control,
                            padding: "7px 9px",
                            color:
                              app.status === "Approved"
                                ? "#15803d"
                                : app.status === "Rejected"
                                ? "#b91c1c"
                                : "#b45309",
                            fontWeight: "bold",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td style={{ ...styles.td, display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          type="button"
                          className="ls-action-button"
                          onClick={() => setSelectedApplication(app)}
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "8px 11px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="ls-action-button"
                          onClick={() => deleteApplication(app.id)}
                          style={{
                            background: "#fff1f2",
                            color: "#dc2626",
                            border: "1px solid #fecdd3",
                            padding: "8px 11px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loadError && isLoadingApplications && (
                    <tr>
                      <td colSpan={6} style={{ padding: "25px", textAlign: "center", color: "#778198" }}>
                        Loading applications from MongoDB...
                      </td>
                    </tr>
                  )}

                  {!isLoadingApplications && filteredApplications.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "35px 15px",
                          textAlign: "center",
                          color: "#778198",
                        }}
                      >
                        No applications found. Submit a demo loan application
                        or change your search/filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {selectedApplication && (
          <div
            role="presentation"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedApplication(null);
              }
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(15, 23, 42, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="application-details-title"
              style={{
                width: "100%",
                maxWidth: "620px",
                maxHeight: "85vh",
                overflowY: "auto",
                background: "#fff",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <h2 id="application-details-title" style={{ margin: "0 0 6px", fontSize: "21px" }}>
                    Application Details
                  </h2>
                  <p style={{ ...styles.muted, margin: 0 }}>
                    Reference: {selectedApplication.id || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close application details"
                  onClick={() => setSelectedApplication(null)}
                  style={{
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: "8px",
                    width: "38px",
                    height: "38px",
                    fontSize: "22px",
                    cursor: "pointer",
                    color: "#334155",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px" }}>
                {[
                  ["Applicant Name", selectedApplication.name],
                  ["Email Address", selectedApplication.email],
                  ["Loan Type", selectedApplication.type],
                  ["Loan Amount", `₹${Number(selectedApplication.amount || 0).toLocaleString("en-IN")}`],
                  ["Application Status", selectedApplication.status || "Pending"],
                  ["Submitted At", selectedApplication.submittedAt],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "14px", border: "1px solid #e2e8f0", borderRadius: "10px", minWidth: 0 }}>
                    <p style={{ margin: "0 0 7px", color: "#64748b", fontSize: "12px" }}>{label}</p>
                    <p style={{ margin: 0, color: "#172033", fontSize: "14px", fontWeight: 600, overflowWrap: "anywhere" }}>
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              <p style={{ margin: "18px 0 0", color: "#64748b", fontSize: "12px", lineHeight: 1.6 }}>
                Demo project only. Application details are loaded from the backend database.
              </p>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                style={{ marginTop: "20px", width: "100%", padding: "12px", border: "none", borderRadius: "8px", background: "#3156d9", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
              >
                Close Details
              </button>
            </section>
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            color: "#8a94a8",
            fontSize: "12px",
            marginTop: "25px",
          }}
        >
          LendSwift © Demo Project · MongoDB-backed applications
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;
