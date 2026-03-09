import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? { ...user } : null);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = () => signOut(auth);

    const updateUsername = async (name) => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
            // Refresh user state
            setUser({ ...auth.currentUser });
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, updateUsername }}>
            {children}
        </AuthContext.Provider>
    );
};



