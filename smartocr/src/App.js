import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ScanReceipts from "./components/ScanReceipts";
import About from "./components/About";
import DataAnalysis from "./components/DataAnalysis";
import Login from "./components/Login";
import Register from "./components/Register";
import TopReviews from "./components/TopReviews";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<ScanReceipts />} />
        <Route path="/about" element={<About />} />
        <Route path="/scan" element={<TopReviews />} />
        <Route path="/analysis" element={<DataAnalysis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;
