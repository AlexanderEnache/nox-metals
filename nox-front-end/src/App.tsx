import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CreateAccount from './components/createAccount.tsx';
import Login from './components/Login.tsx';
import AddProduct from './components/addProduct.tsx';
import ListProducts from './components/listProducts.tsx';
// import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <CreateAccount /> : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<AddProduct />} />
        <Route path="/list-products" element={<ListProducts />} />
        {/* <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> */}

        {/* Redirect any unknown URLs to home */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;