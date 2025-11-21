import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login({ t }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Handle login form submission
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

        // Navigate to products page on success
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
                {/* Login form heading */}
                <h2>{t.loginTitle}</h2>

                {/* Display error message if login fails */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Email input field */}
                    <div className="form-group">
                        <label>{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="etunimi.sukunimi@email.com"
                        />
                    </div>

                    {/* Password input field */}
                    <div className="form-group">
                        <label>{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder={t.password}
                        />
                    </div>

                    {/* Submit button with loading state */}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? t.loggingIn : t.loginButton}
                    </button>
                </form>

                {/* Link to registration page */}
                <p className="register-link">
                    {t.dontHaveAccount} <Link to="/register">{t.registerButton}</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;