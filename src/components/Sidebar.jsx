import React from "react";

export default function Sidebar({ setActivePage, activePage }) {
  return (
    <div className="sidebar">
      <h2 className="logo">MedicNotes Admin</h2>
      <ul>
        <li
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={activePage === "patients" ? "active" : ""}
          onClick={() => setActivePage("patients")}
        >
          Patients
        </li>
        <li
          className={activePage === "doctors" ? "active" : ""}
          onClick={() => setActivePage("doctors")}
        >
          Doctors
        </li>
        <li
          className={activePage === "prescriptions" ? "active" : ""}
          onClick={() => setActivePage("prescriptions")}
        >
          Prescriptions
        </li>
      </ul>
    </div>
  );
}









