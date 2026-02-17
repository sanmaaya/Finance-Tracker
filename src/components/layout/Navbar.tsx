import { NavLink } from 'react-router-dom';
import { Wallet, LayoutDashboard, User, LogOut, PlusCircle, Sun, Moon, Globe } from 'lucide-react';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';

import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setIsFormOpen, setEditingTransaction } = useTransactions();


  return (
    <nav className="navbar glass">
      <div className="container flex items-center justify-between">
        <div className="nav-logo flex items-center gap-2">
          <div className="logo-icon">
            <Wallet size={24} color="white" />
          </div>
          <span className="logo-text">FinTrack</span>
        </div>

        <div className="nav-links flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <button className="nav-link" onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}>
            <PlusCircle size={18} />
            <span>Add Transaction</span>
          </button>
          <NavLink to="/market" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Globe size={18} />
            <span>Market</span>
          </NavLink>
        </div>

        <div className="nav-profile flex items-center gap-4">
          <button className="theme-toggle-btn glass" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="profile-info text-right">
            <p className="profile-name">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="profile-role text-secondary">Premium User</p>
          </div>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'profile-btn glass active' : 'profile-btn glass'}>
            <User size={20} />
          </NavLink>
          <button className="logout-btn" title="Logout" onClick={() => logout()}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
