import React from "react";

const AllocationTable = ({ allocation }) => {
  if (!allocation) return null;

  return (
    <div className="mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Recommended Allocation</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(allocation).map(([category, amount]) => (
            <tr key={category} className="border-t">
              <td className="p-2">{category}</td>
              <td className="p-2">{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllocationTable;
