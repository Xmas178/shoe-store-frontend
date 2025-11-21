import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register({ t }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // Handle registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(email, password, fullName);

        // Navigate to login page on successful registration
        if (result.success) {
            alert(t.registrationSuccess);
            navigate('/login');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                {/* Registration form heading */}
                <h2>{t.createAccount}</h2>

                {/* Display error message if registration fails */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Full name input field */}
                    <div className="form-group">
                        <label>{t.fullName}</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Etunimi Sukunimi"
                        />
                    </div>

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

                    {/* Password input field with minimum length validation */}
                    <div className="form-group">
                        <label>{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder={t.minPasswordLength}
                            minLength="8"
                        />
                    </div>

                    {/* Submit button with loading state */}
                    <button type="submit" disabled={loading} className="register-button">
                        {loading ? t.creatingAccount : t.registerButton}
                    </button>
                </form>

                {/* Link to login page for existing users */}
                <p className="login-link">
                    {t.alreadyHaveAccount} <Link to="/login">{t.loginButton}</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;