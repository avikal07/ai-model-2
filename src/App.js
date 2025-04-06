import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  const [allocation, setAllocation] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <Dashboard setAllocation={setAllocation} allocation={allocation} />
      </div>
    </div>
  );
}

export default App;
