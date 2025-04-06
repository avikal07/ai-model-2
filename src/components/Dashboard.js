import React, { useState } from "react";
import { motion } from "framer-motion";

import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const Dashboard = () => {
  const [salary, setSalary] = useState("");
  const [debt, setDebt] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [data, setData] = useState([]);

  const formatIndianCurrency = (num) => new Intl.NumberFormat("en-IN").format(num);

  const handleInputChange = (e, setter) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    setter(value ? formatIndianCurrency(value) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawSalary = parseInt(salary.replace(/,/g, ""), 10);
      const rawDebt = parseInt(debt.replace(/,/g, ""), 10) || 0;
      const rawInterestRate = parseFloat(interestRate) || 0;

      console.log("Sending API Request:", { salary: rawSalary, debt: rawDebt, interestRate: rawInterestRate });

      const response = await axios.post("http://127.0.0.1:8000/api/recommend/", {
        salary: rawSalary,
        debt: rawDebt,
        interest_rate: rawInterestRate,
      });

      console.log("API Response:", response.data);

      const totalSalary = Object.values(response.data.allocation).reduce((acc, val) => acc + val, 0);

      const formattedData = Object.entries(response.data.allocation).map(([key, value], index) => ({
        category: key,
        amount: value,
        percentage: parseFloat(((value / totalSalary) * 100).toFixed(1)),
        color: COLORS[index % COLORS.length],
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };


  const handleDownloadPDF = () => {
    const input = document.getElementById("dashboard-content");

    html2canvas(input, { scale: 2, scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 10;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Financial_Report.pdf");
    });
  };

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">

      <motion.h2
        className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => window.location.reload()}
        whileTap={{ scale: 0.9 }}
      >
        AI Finance Assistant
      </motion.h2>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <input
            type="text"
            value={salary}
            onChange={(e) => handleInputChange(e, setSalary)}
            placeholder="Enter your salary"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={debt}
            onChange={(e) => handleInputChange(e, setDebt)}
            placeholder="Enter your debt (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="Enter interest rate (%)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-300"
          >
            Get Recommendation
          </button>
        </form>
      </div>


      {data.length > 0 && (
        <div id="dashboard-content" className="mt-6 w-full max-w-4xl">
          <h3 className="text-xl font-bold text-gray-800 mt-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg">
            Bar Chart View
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <h3 className="text-xl font-bold text-gray-800 mt-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg">
            Pie Chart
          </h3>
          {console.log("Pie Chart Data:", data)}

          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  dataKey="percentage"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-4">No data available. Please enter salary and generate recommendations.</p>
          )}

          <div className="mt-6 p-6 bg-gray-100 rounded-2xl w-full shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg">
              Allocation Breakdown
            </h3>
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-xl shadow-md text-center font-medium border border-gray-300 transition-transform transform hover:scale-105">
                  <strong className="text-lg text-gray-900">{item.category}:</strong>{" "}
                  <span className="text-gray-700 text-lg font-semibold">
                    ₹{formatIndianCurrency(item.amount)} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center space-x-4">
            <button onClick={handleDownloadPDF} className="bg-green-500 text-white px-4 py-2 rounded-lg">Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
