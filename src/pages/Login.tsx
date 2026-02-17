import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Wallet, Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';
import './Login.css';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (import.meta.env.VITE_FIREBASE_API_KEY === 'YOUR_API_KEY' || !import.meta.env.VITE_FIREBASE_API_KEY) {
            setError('Firebase is not configured. Please add your credentials to the .env file.');
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass">
                <button className="login-theme-toggle glass" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="login-header">
                    <div className="login-logo">
                        <Wallet size={32} color="white" />
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="subtitle">
                        {isLogin ? 'Enter your details to access your dashboard.' : 'Join FinTrack to manage your finances today.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="login-form">
                    <div className="input-group">
                        <label><Mail size={16} /> Email Address</label>
                        <div className="input-wrapper glass">
                            <input
                                type="email"
                                placeholder="yours@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label><Lock size={16} /> Password</label>
                        <div className="input-wrapper glass">
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        <span>{isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                            {isLogin ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
