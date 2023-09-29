import "./App.css";
import BarChart from "./components/BarChart.js";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";

import React, { useState, useEffect } from "react";

function App() {

  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); 
  const [vendors, setVendors] = useState([]);
  const [years, setYears] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/getVendors", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setVendors(data.data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/getPaymentYears", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setYears(data.data);
      });
  }, []);
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Earning",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });


  useEffect(() => {
    if (selectedVendor && selectedYear) {
      // Fetch data based on selectedVendor and selectedYear
      fetch(`http://localhost:5000/selectMonthly/${selectedYear}/${selectedVendor}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          // Verileri çektiğinizde userData state'ini güncelleyin
          setUserData({
            labels: data.data.map((item) => item.month),
            datasets: [
              {
                ...userData.datasets[0],
                data: data.data.map((item) => item.item_count),
              },
            ],
          });
        });
    }
  }, [selectedVendor, selectedYear]);


  const handleVendorChange = (e) => {
    setSelectedVendor(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };


  return (
    <div className="App">
      <div>
        <label htmlFor="vendorSelect">Select a Vendor:</label>
        <select
          id="vendorSelect"
          className="dropdown-select"
          value={selectedVendor}
          onChange={handleVendorChange}
        >
          <option value="">Select a Vendor</option>
          {vendors.map((vendor, index) => (
            <option key={index} value={vendor.name}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="yearSelect">Select a Year:</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Select a Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div style={{ width: 700 }}>
        <BarChart chartData={userData} />
      </div>
      <div style={{ width: 700 }}>
        <LineChart chartData={userData} />
      </div>
      <div style={{ width: 700 }}>
        <PieChart chartData={userData} />
      </div>
    </div>
  );
}

export default App;