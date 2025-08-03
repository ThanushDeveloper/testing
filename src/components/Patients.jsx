import React from "react";

export default function Patients() {
  return (
    <div className="table-container">
      <h2>Patients List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>30</td>
            <td>9876543210</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>28</td>
            <td>9876543221</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
