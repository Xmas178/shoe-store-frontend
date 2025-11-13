import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    👟 Shoe Store
                </Link>

                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/products" className="navbar-link">
                            Tuotteet
                        </Link>
                    </li>

                    {user ? (
                        <>
                            <li className="navbar-item">
                                <Link to="/cart" className="navbar-link">
                                    🛒 Ostoskori
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/admin" className="navbar-link">
                                    ⚙️ Ylläpito
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <button onClick={logout} className="navbar-button">
                                    Kirjaudu ulos
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link">
                                    Kirjaudu
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/register" className="navbar-link">
                                    Rekisteröidy
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;