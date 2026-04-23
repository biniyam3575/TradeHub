import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, User, LogIn } from 'lucide-react';

const Layout = () => {
  return (
    <div className="app-container">
      <header className="main-header">
        <Link to="/" className="logo">TradeHub</Link>
        <nav>
          <Link to="/"><button className="nav-btn">Home</button></Link>
          <div className="header-icons">
            <Link to="/cart"><ShoppingCart /></Link>
            <Link to="/login"><LogIn /></Link>
            <Link to="/register"><button className="signup-btn">Sign Up</button></Link>
          </div>
        </nav>
      </header>

      <main className="content">
        <Outlet /> {/* This is where Register, Home, etc. will appear */}
      </main>

      <footer className="main-footer">
        <p>&copy; 2026 TradeHub - Professional E-commerce Solution</p>
      </footer>
    </div>
  );
};

export default Layout;