import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  LogOut,
  PieChart as PieIcon,
  Sun,
  Moon,
  Settings,
  User,
  Ghost,
  Sparkles,
  Zap
} from 'lucide-react';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <div className="nav-brand animate-brand">
          <div className="brand-logo-container">
            <img src="/logo.png" alt="Logo" className="brand-logo" />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-name-main">Paise</span>
            <span className="brand-tagline">Bachaaoo</span>
          </div>
        </div>
        <div className="mobile-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'vampire' ? <Ghost size={18} /> :
              theme === 'cyberpunk' ? <Sparkles size={18} /> :
                theme === 'moonlight' ? <Moon size={18} /> :
                  theme === 'dark' ? <Moon size={18} /> :
                    <Sun size={18} />}
          </button>
          <NavLink to="/settings" className="profile-avatar">
            {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <User size={18} />}
          </NavLink>
        </div>
      </div>

      <nav className="navbar premium-navbar">
        <div className="container flex items-center justify-between">
          <NavLink to="/" className="nav-brand flex items-center gap-3 animate-brand">
            <div className="brand-logo-container">
              <img src="/logo.png" alt="Logo" className="brand-logo" />
            </div>
            <div className="brand-text-container">
              <span className="brand-name-main">Paise</span>
              <span className="brand-tagline">Bachaaoo</span>
            </div>
          </NavLink>

          <div className="nav-tabs">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/installments" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>
              <Zap size={18} />
              <span>Vault</span>
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>
              <PieIcon size={18} />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/market" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>
              <TrendingUp size={18} />
              <span>Market</span>
            </NavLink>
            {/* Added Settings to mobile tabs for better reachability */}
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab mobile-only'}>
              <Settings size={18} />
              <span className="md:inline">Settings</span>
            </NavLink>
          </div>

          <div className="nav-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'vampire' ? <Ghost size={20} /> :
                theme === 'cyberpunk' ? <Sparkles size={20} /> :
                  theme === 'moonlight' ? <Moon size={20} /> :
                    theme === 'dark' ? <Moon size={20} /> :
                      <Sun size={20} />}
            </button>

            <div className="nav-profile">
              <NavLink to="/settings" className="flex items-center gap-3">
                <div className="profile-avatar">
                  {user?.photoURL ? <img src={user.photoURL} alt="P" /> : <User size={18} />}
                </div>
                <div className="profile-info">
                  <p className="profile-name">{user?.displayName || 'User'}</p>
                </div>
              </NavLink>
              <button
                className="logout-btn p-2 hover:text-rose-500 transition-colors"
                onClick={() => logout()}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
