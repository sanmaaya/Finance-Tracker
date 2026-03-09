import React, { useState, useEffect } from 'react';
import { User, Shield, Download, Upload, RefreshCw, Check, Tag, Plus, X as XIcon, Lock, Globe, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import './Settings.css';

const Settings = () => {
    const { user, updateUsername } = useAuth();
    const { theme, setTheme, isLight } = useTheme();
    const {
        transactions,
        installments,
        updateCurrency,
        currency: globalCurrency,
        seedDefaultData,
        resetAllData,
        importAllData
    } = useTransactions();

    const [profile, setProfile] = useState({
        username: user?.displayName || '',
        phone: localStorage.getItem('user_phone') || ''
    });

    useEffect(() => {
        if (user?.displayName) {
            const timer = setTimeout(() => {
                setProfile(prev => {
                    if (prev.username === (user.displayName || '')) return prev;
                    return { ...prev, username: user.displayName || '' };
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const [preferences, setPreferences] = useState({
        currency: globalCurrency,
        monthlyBudget: localStorage.getItem('pref_monthlyBudget') || '50000'
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('pref_categories');
        return saved ? JSON.parse(saved) : [
            'Food & Drinks', 'Shopping', 'Housing', 'Transportation',
            'Entertainment', 'Salary', 'Investment', 'Others'
        ];
    });

    const [newCategory, setNewCategory] = useState('');

    const themes = [
        { id: 'dark', name: 'Midnight', color: '#0c0a09' },
        { id: 'vampire', name: 'Vampire', color: '#ff0000' },
        { id: 'cyberpunk', name: 'Cyberpunk', color: '#f0abfc' },
        { id: 'moonlight', name: 'Moonlight', color: '#94a3b8' },
        { id: 'light', name: 'Cloud', color: '#fafaf9' }
    ];

    const handleProfileSave = async (e) => {
        if (e) e.preventDefault();
        try {
            if (profile.username && profile.username !== user?.displayName) {
                await updateUsername(profile.username);
            }
            updateCurrency(preferences.currency);
            localStorage.setItem('user_phone', profile.phone);
            localStorage.setItem('pref_monthlyBudget', preferences.monthlyBudget);
            localStorage.setItem('pref_categories', JSON.stringify(categories));
            alert('Settings Synchronized ✨');
        } catch (error) {
            console.error(error);
            alert('Sync failed. Please try again.');
        }
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const removeCategory = (cat) => {
        setCategories(categories.filter(c => c !== cat));
    };

    const exportData = () => {
        const fullData = { transactions, installments, exportedAt: new Date().toISOString(), version: '2.0' };
        const dataStr = JSON.stringify(fullData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `paisa_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
    };

    const resetData = async () => {
        if (window.confirm('Erase all vault records? This is irreversible.')) {
            try {
                await resetAllData();
                alert('Vault Purged Successfully ✨');
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const imported = JSON.parse(event.target?.result);
                if (window.confirm('Merge imported records into your vault?')) {
                    await importAllData(imported);
                    alert('Data Integrated Successfully 🚀');
                }
            } catch (err) {
                console.error(err);
                alert('Import Failed.');
            }
        };
        reader.readAsText(file);
    };

    const inputStyle = {
        width: "100%", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "14px 16px",
        color: theme.text, fontSize: "0.95rem", outline: "none", transition: "all 0.3s", fontWeight: 500
    };

    const cardStyle = {
        background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "32px",
        boxShadow: isLight ? "0 10px 30px rgba(0,0,0,0.05)" : "0 10px 30px rgba(0,0,0,0.2)", height: "100%"
    };

    return (
        <div style={{ padding: "40px 24px", minHeight: "100vh", position: "relative" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <header style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                    <div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: theme.text, letterSpacing: "-1px" }}>Command Center</h1>
                        <p style={{ color: theme.textMuted, fontSize: "1rem", marginTop: 8 }}>Configure your global vault parameters.</p>
                    </div>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 32 }}>

                    {/* PROFILE */}
                    <div style={cardStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.accent}20`, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={20} />
                            </div>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>Identity</h2>
                        </div>
                        <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: theme.textMuted, marginBottom: 10, fontWeight: 700 }}>Vault Alias</label>
                                <input style={inputStyle} type="text" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: theme.textMuted, marginBottom: 10, fontWeight: 700 }}>Secure Channel (Email)</label>
                                <div style={{ ...inputStyle, background: theme.surface + "80", opacity: 0.7, cursor: "not-allowed", display: "flex", alignItems: "center", gap: 10 }}>
                                    <Lock size={14} /> {user?.email}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: theme.textMuted, marginBottom: 10, fontWeight: 700 }}>Mobile Uplink</label>
                                <input style={inputStyle} type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <button type="submit" className="btn-save-lux" style={{
                                width: "100%", padding: "14px", borderRadius: 14, border: "none", background: theme.accent, color: isLight ? "#fff" : theme.bg,
                                fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                            }}>
                                <Save size={18} /> Update Identity
                            </button>
                        </form>
                    </div>

                    {/* PREFERENCES */}
                    <div style={cardStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.purp || '#8b5cf6'}20`, color: theme.purp || '#8b5cf6', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Globe size={20} />
                            </div>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>Global Preferences</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: theme.textMuted, marginBottom: 12, fontWeight: 700 }}>Interface Theme</label>
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    {themes.map(t => (
                                        <button key={t.id} onClick={() => setTheme(t.id)} style={{
                                            padding: "8px 16px", borderRadius: 12, border: "2px solid", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, transition: "all 0.3s",
                                            borderColor: theme.themeId === t.id ? theme.accent : theme.border,
                                            background: theme.themeId === t.id ? `${theme.accent}15` : theme.surface,
                                            color: theme.themeId === t.id ? theme.accent : theme.textMuted
                                        }}>
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: theme.textMuted, marginBottom: 10, fontWeight: 700 }}>Vault Currency</label>
                                <select style={{ ...inputStyle, appearance: "none" }} value={preferences.currency} onChange={e => {
                                    const c = e.target.value; setPreferences({ ...preferences, currency: c }); updateCurrency(c);
                                }}>
                                    <option value="INR">Indian Rupee (₹)</option>
                                    <option value="USD">US Dollar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                    <option value="GBP">British Pound (£)</option>
                                    <option value="JPY">Japanese Yen (¥)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: theme.textMuted, marginBottom: 10, fontWeight: 700 }}>Monthly Budget Velocity</label>
                                <input style={inputStyle} type="number" value={preferences.monthlyBudget} onChange={e => setPreferences({ ...preferences, monthlyBudget: e.target.value })} />
                            </div>
                            <button onClick={handleProfileSave} className="btn-save-lux" style={{
                                width: "100%", padding: "14px", borderRadius: 14, border: "none", background: theme.accent, color: isLight ? "#fff" : theme.bg,
                                fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                            }}>
                                <Check size={18} /> Apply Preferences
                            </button>
                        </div>
                    </div>

                    {/* CATEGORIES */}
                    <div style={cardStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.pos}20`, color: theme.pos, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Tag size={20} />
                            </div>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>Focus Segments</h2>
                        </div>
                        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                            <input style={{ ...inputStyle, flex: 1 }} type="text" placeholder="Add custom segment..." value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                            <button onClick={addCategory} style={{
                                width: 50, borderRadius: 14, border: "none", background: theme.accent, color: isLight ? "#fff" : theme.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                            }}><Plus size={20} /></button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxHeight: 200, overflowY: "auto", padding: 2 }}>
                            {categories.map(cat => (
                                <div key={cat} style={{
                                    padding: "6px 12px", borderRadius: 10, background: theme.surface, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, color: theme.text
                                }}>
                                    {cat}
                                    <XIcon size={14} style={{ cursor: "pointer", color: theme.neg }} onClick={() => removeCategory(cat)} />
                                </div>
                            ))}
                        </div>
                        <button onClick={handleProfileSave} className="btn-save-lux" style={{
                            width: "100%", padding: "14px", borderRadius: 14, border: "none", background: `${theme.text}10`, color: theme.text,
                            fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", marginTop: 24, transition: "all 0.3s"
                        }}>Synchronize Segments</button>
                    </div>

                    {/* DATA MANAGEMENT */}
                    <div style={cardStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.neg}20`, color: theme.neg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Shield size={20} />
                            </div>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>Vault Continuity</h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <button onClick={exportData} style={{
                                padding: "16px", borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text,
                                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "all 0.3s"
                            }} className="data-action-card">
                                <Download size={24} />
                                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Archive Vault</span>
                            </button>
                            <label style={{
                                padding: "16px", borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text,
                                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "all 0.3s"
                            }} className="data-action-card">
                                <Upload size={24} />
                                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Extract Backup</span>
                                <input type="file" accept=".json" hidden onChange={handleImport} />
                            </label>
                            <button onClick={seedDefaultData} style={{
                                padding: "16px", borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text,
                                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "all 0.3s"
                            }} className="data-action-card">
                                <RefreshCw size={24} />
                                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Seed Intel</span>
                            </button>
                            <button onClick={resetData} style={{
                                padding: "16px", borderRadius: 16, border: `1px solid ${theme.neg}30`, background: `${theme.neg}10`, color: theme.neg,
                                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "all 0.3s"
                            }} className="data-action-card danger">
                                <XIcon size={24} />
                                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Purge Vault</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .btn-save-lux:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 8px 20px ${theme.accent}40; }
                .data-action-card:hover { border-color: ${theme.accent} !important; background: ${theme.surface}e0 !important; transform: scale(1.02); }
                .data-action-card.danger:hover { background: ${theme.neg}20 !important; border-color: ${theme.neg} !important; }
                input:focus, select:focus { border-color: ${theme.accent} !important; }
                *::-webkit-scrollbar { width: 6px; }
                *::-webkit-scrollbar-track { background: transparent; }
                *::-webkit-scrollbar-thumb { background: ${theme.border}; borderRadius: 10px; }
            `}</style>
        </div>
    );
};

export default Settings;
