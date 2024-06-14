import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('./components/HomePage'));
const  CreateOrder = lazy(() => import('./components/CreateOrder'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const InventoryPage = lazy(() => import('./components/InventoryPage'));
const AboutWarehouse = lazy(() => import('./components/AboutWarehouse'));
const Contact = lazy(() => import('./components/Contact'));
const NavBar = lazy(() => import('./components/NavBar'));
const ManagerView  = lazy(() => import('./manager/ManagerView'));
const EditInventory  = lazy(() => import('./manager/EditInventory'));
const AddNewProduct  = lazy(() => import('./manager/AddNewProduct'));


function App() {
  return (
    <Router> 
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage/>} />
            <Route path="/createOrder" element={<CreateOrder/>} />
            <Route path="/InventoryPage" element={<InventoryPage />} />
            <Route path="/manager" element={<ManagerView/>} />
            <Route path="/edit-inventory" element={<EditInventory />} />
            <Route path="/AddNewProduct" element={<AddNewProduct />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
