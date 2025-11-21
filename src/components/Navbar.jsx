import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import './Navbar.css';

const Navbar = ({ language, setLanguage, t }) => {
    const navigate = useNavigate();

    // Check authentication status from localStorage
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Handle user logout - clear localStorage and redirect to home
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">ShoeStore</Link>
            </div>

            <div className="navbar-links">
                {/* Main navigation links with translations */}
                <Link to="/">{t.home}</Link>
                <Link to="/products">{t.products}</Link>
                <Link to="/cart">{t.cart}</Link>

                {/* Conditional rendering based on authentication */}
                {!token ? (
                    <>
                        {/* Show login/register for non-authenticated users */}
                        <Link to="/login">{t.login}</Link>
                        <Link to="/register">{t.register}</Link>
                    </>
                ) : (
                    <>
                        {/* Show admin panel for admin users only */}
                        {isAdmin && <Link to="/admin">{t.admin}</Link>}

                        {/* Logout button for authenticated users */}
                        <button onClick={handleLogout} className="logout-btn">
                            {t.logout}
                        </button>
                    </>
                )}

                {/* Language selector component */}
                <LanguageSelector
                    currentLanguage={language}
                    onLanguageChange={setLanguage}
                />
            </div>
        </nav>
    );
};

export default Navbar;