import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomHeader from './components/Header';
import SalesPage from './pages/SalesPage'; // Import the SalesPage component
import ReportPage from './pages/ReportPage'; // Assuming you will create this page similarly
import './App.css';

function App() {
  return (
    <Router>
      <Layout className="app">
        <CustomHeader />
        <Routes>
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/" element={<SalesPage />} /> {/* Default route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
