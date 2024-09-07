import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomHeader from './components/Header';
import TransactionPage from './pages/TransactionPage'; // Import the SalesPage component
import SalesPage from './pages/SalesPage'; // Import the SalesPage component
import CustomerPage from './pages/CustomerPage'; // Assuming you will create this page similarly
import ProductPage from './pages/ProductPage'; // Assuming you will create this page similarly
import './App.css';

function App() {
  return (
    <Router>
      <Layout className="app">
        <CustomHeader />
        <Routes>
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/" element={<SalesPage />} /> {/* Default route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
