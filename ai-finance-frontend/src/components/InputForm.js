import React, { useState } from "react";
import axios from "axios";

const InputForm = () => {
  const [salary, setSalary] = useState("");
  const [allocation, setAllocation] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/recommend/", {
        salary: parseFloat(salary),
      });
      
      // FIX: Extract the nested object from API response
      setAllocation(response.data["salary allocation"]);

      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch data. Check backend.");
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Financial Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Enter your salary"
          required
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", background: "blue", color: "white", padding: "5px 10px" }}
        >
          Get Recommendation
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {allocation && (
        <div>
          <h3>Recommended Allocation</h3>
          <ul>
            {Object.entries(allocation).map(([category, amount]) => (
              <li key={category}>
                <strong>{category}:</strong> ₹{amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputForm;
