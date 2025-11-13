import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(email, password, fullName);

        if (result.success) {
            alert('Rekisteröinti onnistui! Voit nyt kirjautua sisään.');
            navigate('/login');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Luo tili</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nimi</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Etunimi Sukunimi"
                        />
                    </div>

                    <div className="form-group">
                        <label>Sähköposti</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="etunimi.sukunimi@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Salasana</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Vähintään 8 merkkiä"
                            minLength="8"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="register-button">
                        {loading ? 'Luodaan tiliä...' : 'Rekisteröidy'}
                    </button>
                </form>

                <p className="login-link">
                    Onko sinulla jo tili? <Link to="/login">Kirjaudu tästä</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;