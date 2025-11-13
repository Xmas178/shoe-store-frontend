import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="hero">
                <h1>Tervetuloa kenkäkauppaan! 👟</h1>
                <p>Löydä täydelliset kengät jokaiseen tilanteeseen</p>
                <Link to="/products" className="cta-button">
                    Selaa tuotteita
                </Link>
            </div>

            <div className="features">
                <div className="feature">
                    <h3>🚚 Ilmainen toimitus</h3>
                    <p>Yli 50€ tilauksiin</p>
                </div>
                <div className="feature">
                    <h3>↩️ Helppo palautus</h3>
                    <p>14 päivän palautusoikeus</p>
                </div>
                <div className="feature">
                    <h3>⭐ Laadukkaat tuotteet</h3>
                    <p>Vain parhaat brändit</p>
                </div>
            </div>
        </div>
    );
}

export default Home;