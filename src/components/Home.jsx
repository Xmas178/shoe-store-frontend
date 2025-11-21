import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ t }) => {
    return (
        <div className="home">
            <div className="hero">
                {/* Main welcome heading with translation */}
                <h1>{t.welcomeTitle}</h1>

                {/* Welcome description text with translation */}
                <p>{t.welcomeText}</p>

                {/* Call-to-action button linking to products page */}
                <Link to="/products" className="cta-button">
                    {t.shopNow}
                </Link>
            </div>
        </div>
    );
};

export default Home;