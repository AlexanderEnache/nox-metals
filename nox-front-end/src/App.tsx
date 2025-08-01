import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CreateAccount from './components/createAccount.tsx';
import Login from './components/Login.tsx';
import AddProduct from './components/addProduct.tsx';
import ListProducts from './components/listProducts.tsx';
import EditProduct from './components/editProduct.tsx';
// import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editProfileId, setEditProfileId] = useState<number | null>(null);;

  const getIsLoggedIn = () => isLoggedIn;
  const getIsAdmin = () => isAdmin;
  const getEditProfileId = () => editProfileId;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/create-account" element={<CreateAccount />} />

        <Route
          path="/add-product"
          element={
            ( isLoggedIn ) ? <AddProduct /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/list-products"
          element={
            isLoggedIn ? <ListProducts getIsAdmin={getIsAdmin} setEditProfileId={setEditProfileId} /> : <Navigate to="/" replace />
          }
        />

        <Route path="/edit-profile" element={<EditProduct getEditProfileId={getEditProfileId} />} />

        <Route path="/login" element={<AddProduct />} />
        {/* <Route path="/list-products" element={<ListProducts />} /> */}
        {/* <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> */}

        {/* Redirect any unknown URLs to home */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;