import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const saveAuthToken = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    const removeAuthToken = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, saveAuthToken, removeAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
