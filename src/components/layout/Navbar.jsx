import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  PieChart as PieIcon,
  Settings,
  User,
  Zap,
  Globe
} from 'lucide-react';
import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { THEMES } from '../../constants/themes';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, isLight } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const PAGES = [
    { name: "Overview", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Market", path: "/market", icon: <Globe size={18} /> },
    { name: "Analytics", path: "/analytics", icon: <PieIcon size={18} /> },
    { name: "Vault", path: "/installments", icon: <Zap size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? theme.navBg : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${theme.border}` : "none",
      transition: "all 0.4s ease",
      padding: "0 20px",
      height: "68px"
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", height: "100%", gap: "12px" }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginRight: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>💰</div>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem",
            color: theme.accent, display: "block"
          }} className="nav-logo-text">Paise Bachaaoo</span>
        </NavLink>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "4px", flex: 1, overflowX: "auto", scrollbarWidth: "none" }} className="nav-links-scrollable">
          {PAGES.map(p => (
            <NavLink key={p.path} to={p.path}
              className={({ isActive }) => `nav-link-new ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12,
                textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem",
                background: isActive ? `${theme.accent}18` : "transparent",
                color: isActive ? theme.accent : theme.textMuted,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              })}>
              <span style={{ fontSize: "0.9rem", display: "flex", alignItems: "center" }}>{p.icon}</span>
              <span className="nav-text-desktop">{p.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Theme dots (Desktop) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", borderRadius: 50, padding: "6px 12px", border: `1px solid ${theme.border}` }} className="theme-dots-container">
          {Object.values(THEMES).map(t => (
            <div key={t.id} onClick={() => setTheme(t)}
              title={t.label}
              style={{
                width: 16, height: 16, borderRadius: "50%", cursor: "pointer",
                background: `linear-gradient(135deg, ${t.orb1}, ${t.orb2})`,
                border: theme.id === t.id ? `2px solid ${t.accent}` : "2px solid transparent",
                transform: theme.id === t.id ? "scale(1.25)" : "scale(1)",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: theme.id === t.id ? `0 0 10px ${t.accent}80` : "none",
              }} />
          ))}
        </div>

        {/* Avatar / Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <NavLink to="/settings" style={{ textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.orb2 || theme.accent})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", cursor: "pointer", border: `2px solid ${theme.border}`,
              color: isLight ? "#fff" : theme.bg, fontWeight: "bold"
            }}>
              {user?.displayName ? user.displayName[0] : <User size={18} />}
            </div>
          </NavLink>
          <button onClick={logout} style={{
            color: theme.textMuted, background: "none", border: "none", padding: "8px",
            cursor: "pointer", display: "flex", alignItems: "center"
          }} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
      <style>{`
                .nav-link-new.active {
                   border-bottom: 2px solid ${theme.accent};
                }
                .nav-link-new:hover {
                    color: ${theme.accent} !important;
                }
                @media (max-width: 640px) {
                    .nav-logo-text { font-size: 0.9rem !important; }
                    .nav-text-desktop { display: none !important; }
                    .theme-dots-container { display: none !important; }
                }
                .nav-links-scrollable::-webkit-scrollbar { display: none; }
            `}</style>
    </nav>
  );
};

export default Navbar;
