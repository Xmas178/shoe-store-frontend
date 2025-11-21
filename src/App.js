import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import { translations } from './translations/translations';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  return (
    <Router>
      <div className="App">
        <Navbar
          language={language}
          setLanguage={setLanguage}
          t={t}
        />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/products" element={<ProductList t={t} />} />
            <Route path="/products/:id" element={<ProductDetail t={t} />} />
            <Route path="/cart" element={<Cart t={t} />} />
            <Route path="/login" element={<Login t={t} />} />
            <Route path="/register" element={<Register t={t} />} />
            <Route path="/admin" element={<Admin t={t} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;