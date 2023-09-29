import React, { useEffect, useState } from "react";
import "./App.css";
import Pagination from "./Pagination";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import MonthlyAnalysis from "./MonthlyAnalysis";

function AllTimeAnalysis() {
  const [column, setColumn] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false); // Başlangıçta loading false
  const [productFilter, setProductFilter] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendors, setVendors] = useState([]);

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
    if (selectedVendor) {
      setIsLoading(true); // Seçilen bir satıcı olduğunda loading true yap
      fetch(`http://localhost:5000/getProductSalesForVendor/${selectedVendor}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          const columnNames = Object.keys(data.data[0]);
          const formattedColumnNames = columnNames.map((columnName) =>
            columnName.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
          );
          setColumn(formattedColumnNames);
          setRecords(data.data);
          setIsLoading(false); // Veriler geldiğinde loading false yap
        });
    } else {
      setRecords([]); // Satıcı seçili değilse verileri temizle
    }
  }, [selectedVendor]);

  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;

  const filteredRecords = records.filter((record) =>
    record.product_name.toLowerCase().includes(productFilter.toLowerCase())
  );

  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateItemsPerPage = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleVendorChange = (e) => {
    setSelectedVendor(e.target.value);
  };

  return (
      <div>
        <Routes>
          <Route path="/MonthlyAnalysis" element={<MonthlyAnalysis />} />
        </Routes>
        <h1
          style={{
            textAlign: "center",
            color: "#3498db",
            backgroundColor: "#f2f2f2",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          Product Sales Analysis for Vendor
        </h1>
      <div className="filter-bar">
  <label htmlFor="vendorSelect">Select a Vendor:</label>
  <select
    id="vendorSelect"
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
     
        <label htmlFor="itemsPerPageSelect">      Items Per Page:</label>
  <select
    id="itemsPerPageSelect"
    value={itemsPerPage}
    onChange={(e) => updateItemsPerPage(parseInt(e.target.value))}
  >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <label htmlFor="productFilter">Filter by Product Name:</label>
  <input
    id="productFilter"
    type="text"
    value={productFilter}
    onChange={(e) => setProductFilter(e.target.value)}
  />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                {column.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, i) => (
                <tr key={i}>
                  <td>{record.product_name}</td>
                  <td>{record.vendor_name}</td>
                  <td>{record.total_sales_count}</td>
                  <td>{record.total_earning} $</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredRecords.length}
            paginate={paginate}
          />
        </>
      )}
    </div>

  );
}

export default AllTimeAnalysis;
