import React from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
    return (
        <div className="language-selector">
            <button
                className={currentLanguage === 'en' ? 'active' : ''}
                onClick={() => onLanguageChange('en')}
            >
                EN
            </button>
            <button
                className={currentLanguage === 'fi' ? 'active' : ''}
                onClick={() => onLanguageChange('fi')}
            >
                FI
            </button>
        </div>
    );
};

export default LanguageSelector;
