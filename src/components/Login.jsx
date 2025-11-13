import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== LOGIN FORM SUBMITTED ===');
        console.log('Email:', email);
        console.log('Password length:', password.length);

        setError('');
        setLoading(true);

        console.log('Calling login function...');
        const result = await login(email, password);
        console.log('Login result:', result);

        if (result.success) {
            console.log('SUCCESS - navigating to products');
            navigate('/products');
        } else {
            console.log('FAILED - showing error');
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Kirjaudu sisään</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                            placeholder="Salasanasi"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Kirjaudutaan...' : 'Kirjaudu'}
                    </button>
                </form>

                <p className="register-link">
                    Eikö sinulla ole tiliä? <Link to="/register">Rekisteröidy tästä</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;