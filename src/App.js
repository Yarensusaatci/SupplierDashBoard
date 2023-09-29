import AllTimeAnalysis from './AllTimeAnalysis';
import MonthlyAnalysis from './MonthlyAnalysis';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './styles.css'; // CSS dosyasını içe aktarın

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/AllTimeAnalysis" className="button-link">General Analysis</Link>
            </li>
            <li>
              <Link to="/MonthlyAnalysis" className="button-link">Monthly Analysis</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/AllTimeAnalysis" element={<AllTimeAnalysis />} />
          <Route path="/MonthlyAnalysis" element={<MonthlyAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
