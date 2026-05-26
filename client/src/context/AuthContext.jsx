import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('sereneToken') || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('sereneToken', token);
            const storedUser = localStorage.getItem('sereneUser');
            if (storedUser) setUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem('sereneToken');
            localStorage.removeItem('sereneUser');
            setUser(null);
        }
        setIsLoading(false);
    }, [token]);

    const login = (userData, authToken) => {
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('sereneUser', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sereneSessionId'); // Optional: clear chat session on logout
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
