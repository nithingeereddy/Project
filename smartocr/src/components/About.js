import React from "react";
import "./About.css"; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        
        {/* Logo Section */}
        <div>
          <img src="/logo3.png" alt="SmartOCR Logo" className="about-logo" />
        </div>

        {/* Content Section */}
        <div className="about-text">
          <h1 className="about-title">About SmartOCR</h1>
          <p className="about-description">
            SmartOCR is an intelligent receipt data extraction tool that automates 
            the process of extracting and managing data from customer receipts. 
            It leverages OCR (Optical Character Recognition) technology to efficiently 
            process scanned receipts and convert them into structured digital data.
          </p>

          <div className="about-features">
            <h2>Why SmartOCR?</h2>
            <ul>
              <li>🔹 Automates receipt data extraction with high accuracy.</li>
              <li>🔹 Saves time by eliminating manual data entry.</li>
              <li>🔹 Integrates seamlessly with modern applications.</li>
              <li>🔹 Provides structured data for better financial tracking.</li>
            </ul>
          </div>

          <a href="/get-started" className="about-button">
            Get Started
          </a>
        </div>

      </div>
    </div>
  );
};

export default About;
