import React from "react";

export default function AnimalTable() {
  const animals = [
    { name: "Lion", type: "Mammal", habitat: "Savannah" },
    { name: "Eagle", type: "Bird", habitat: "Mountains" },
    { name: "Shark", type: "Fish", habitat: "Ocean" },
    { name: "Elephant", type: "Mammal", habitat: "Savannah" },
    { name: "Penguin", type: "Bird", habitat: "Antarctica" },
  ];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const thStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  };

  const trStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
  });

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Habitat</th>
        </tr>
      </thead>
      <tbody>
        {animals.map((animal, index) => (
          <tr key={index} style={trStyle(index)}>
            <td style={tdStyle}>{animal.name}</td>
            <td style={tdStyle}>{animal.type}</td>
            <td style={tdStyle}>{animal.habitat}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
