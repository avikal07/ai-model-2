import React from "react";

const Recommendation = ({ allocation }) => {
  if (!allocation) return <p>No recommendations yet.</p>;

  return (
    <div className="recommendation-container">
      <h3 className="text-xl font-bold mb-4">Recommended Salary Allocation</h3>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(allocation).map(([category, amount]) => (
            <tr key={category} className="border-t">
              <td className="border p-2">{category}</td>
              <td className="border p-2">₹{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendation;
