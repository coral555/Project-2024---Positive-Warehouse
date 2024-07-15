import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/navbar/navbar';
import { NavbarManger } from './manager/components/navbar/navbar';
import { Cart } from './pages/cart/cart';
import { Home } from './pages/Home/Home';
import { View } from './pages/ViewInventory/ViewInventory';
import { ProductDetail } from './pages/ProductDetail/ProductDetail';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/clientIndex';
import AboutWarehouse from './pages/AboutWarehouse/AboutWarehouse';
import Contact from './pages/Contact/Contact';
import { CombinedProvider } from './context/CombinedContext';
import AddNewProduct from './manager/pages/AddNewProduct/AddNewProduct';
import ProtectedRoute from './pages/Login/ProtectedRoute';
import EditInventory from './manager/pages/EditInventory/EditInventory';
import LoginPage from './pages/Login/LoginPage';
import ManageOrders from './manager/pages/ManageOrders/ManageOrders';
import ManageCategories from './manager/pages/ManageCategories/ManageCategories';
import Reports from './manager/pages/Reports/Reports';
import './App.css'; // Import the CSS file

const store = createStore(rootReducer);

function RoutesWrapper({ isAuthenticated, handleLogin }) {
  const location = useLocation();

  return (
    <div className="myapp-content-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ViewInventory" element={<View />} />
        <Route path="/AboutWarehouse" element={<AboutWarehouse />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/LoginPage" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/editInventory"
          element={
            isAuthenticated ? (
              <>
                <NavbarManger />
                <ProtectedRoute isAuthenticated={isAuthenticated} element={<EditInventory />} />
              </>
            ) : (
              <Navigate to="/LoginPage" replace />
            )
          }
        />
        <Route
          path="/Reports"
          element={
            isAuthenticated ? (
              <>
                <NavbarManger />
                <ProtectedRoute isAuthenticated={isAuthenticated} element={<Reports />} />
              </>
            ) : (
              <Navigate to="/LoginPage" replace />
            )
          }
        />
        <Route
          path="/AddNewProduct"
          element={
            isAuthenticated ? (
              <>
                <NavbarManger />
                <ProtectedRoute isAuthenticated={isAuthenticated} element={<AddNewProduct />} />
              </>
            ) : (
              <Navigate to="/LoginPage" replace />
            )
          }
        />
        <Route
          path="/ManageOrders"
          element={
            isAuthenticated ? (
              <>
                <NavbarManger />
                <ProtectedRoute isAuthenticated={isAuthenticated} element={<ManageOrders />} />
              </>
            ) : (
              <Navigate to="/LoginPage" replace />
            )
          }
        />
        <Route
          path="/ManageCategories"
          element={
            isAuthenticated ? (
              <>
                <NavbarManger />
                <ProtectedRoute isAuthenticated={isAuthenticated} element={<ManageCategories />} />
              </>
            ) : (
              <Navigate to="/LoginPage" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userEmail) => {
    setIsAuthenticated(true);
    console.log(`User logged in: ${userEmail}`);
  };

  return (
    <div className="myapp-App">
      <CombinedProvider>
        <Provider store={store}>
          <Router>
            <Navbar />
            <RoutesWrapper isAuthenticated={isAuthenticated} handleLogin={handleLogin} />
          </Router>
        </Provider>
      </CombinedProvider>
    </div>
  );
}

export default App;
