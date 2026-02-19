import React, { useState } from 'react';
import { User, Shield, Download, Upload, RefreshCw, Palette, Check, Coins, Tag, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import './Settings.css';

const Settings = () => {
    const { user, updateUsername } = useAuth();
    const { theme, setTheme } = useTheme();
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

    // Sync profile state when user loads
    React.useEffect(() => {
        if (user?.displayName) {
            setProfile(prev => ({ ...prev, username: user.displayName || '' }));
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
        { id: 'vampire', name: 'Vampire', color: '#ff0000' },
        { id: 'cyberpunk', name: 'Cyberpunk', color: '#f0abfc' },
        { id: 'moonlight', name: 'Moonlight', color: '#94a3b8' },
        { id: 'dark', name: 'Midnight', color: '#0c0a09' },
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

            alert('Profile & Preferences updated successfully! ✨');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile. Please try again.');
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
        const fullData = {
            transactions,
            installments,
            exportedAt: new Date().toISOString(),
            version: '2.0'
        };
        const dataStr = JSON.stringify(fullData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `paisa_backup_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const resetData = async () => {
        if (window.confirm('Are you sure you want to delete ALL transactions and plans? This cannot be undone.')) {
            try {
                await resetAllData();
                alert('All data has been wiped clean. ✨');
            } catch (error) {
                alert('Failed to reset data. Please check your connection.');
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

                if (!imported.transactions && !imported.installments) {
                    throw new Error("Invalid file format");
                }

                if (window.confirm('This will add all data from the file to your current account. Continue?')) {
                    await importAllData(imported);
                    alert('Data imported successfully! 🚀');
                }
            } catch (err) {
                console.error(err);
                if (err.code === 'permission-denied') {
                    alert('Permission Denied: Your Firebase security rules are blocking this import.');
                } else {
                    alert('Failed to import data. Ensure the file is a valid Paisa backup and you have a stable connection.');
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-page container">
            <h1 className="welcome-text mb-8">Account Settings</h1>

            <div className="settings-grid">
                {/* Profile Section */}
                <div className="settings-card glass">
                    <h2 className="settings-section-title">
                        <User size={20} className="text-primary" /> Personal Information
                    </h2>
                    <form onSubmit={handleProfileSave} className="profile-form">
                        <div className="settings-input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                onChange={e => setProfile({ ...profile, username: e.target.value })}
                                placeholder="Paisa User"
                            />
                        </div>
                        <div className="settings-input-group">
                            <label>Email Address</label>
                            <input type="email" value={user?.email || ''} disabled />
                        </div>
                        <div className="settings-input-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                        <button type="submit" className="save-profile-btn">Save Changes</button>
                    </form>
                </div>

                {/* Appearance Section */}
                <div className="settings-card glass">
                    <h2 className="settings-section-title">
                        <Palette size={20} className="text-primary" /> Themes
                    </h2>
                    <div className="theme-options-grid mb-8">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                className={`theme-option-btn ${theme === t.id ? 'active' : ''}`}
                                onClick={() => setTheme(t.id)}
                            >
                                <div className="theme-preview" style={{ backgroundColor: t.color }}>
                                    {theme === t.id && <Check size={14} color="#fff" />}
                                </div>
                                <span className="theme-name">{t.name}</span>
                            </button>
                        ))}
                    </div>

                    <h2 className="settings-section-title">
                        <Coins size={20} className="text-primary" /> Localization
                    </h2>
                    <div className="settings-input-group">
                        <label>Preferred Currency</label>
                        <select
                            className="currency-select"
                            value={preferences.currency}
                            onChange={e => {
                                const newCurr = e.target.value;
                                setPreferences({ ...preferences, currency: newCurr });
                                updateCurrency(newCurr);
                            }}
                        >
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                            <option value="GBP">British Pound (£)</option>
                            <option value="JPY">Japanese Yen (¥)</option>
                        </select>
                        <div className="settings-input-group mt-4">
                            <label>Monthly Budget ({preferences.currency})</label>
                            <input
                                type="number"
                                value={preferences.monthlyBudget}
                                onChange={e => setPreferences({ ...preferences, monthlyBudget: e.target.value })}
                                placeholder="e.g. 50000"
                            />
                        </div>
                        <button
                            type="button"
                            className="save-profile-btn mt-6"
                            onClick={handleProfileSave}
                        >
                            Update Preferences
                        </button>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="settings-card glass">
                    <h2 className="settings-section-title">
                        <Tag size={20} className="text-primary" /> Categories Management
                    </h2>
                    <div className="settings-input-group mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                placeholder="New category name..."
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                className="save-profile-btn"
                                style={{ marginTop: 0, padding: '0 1rem' }}
                                onClick={addCategory}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="category-list-chips">
                        {categories.map(cat => (
                            <div key={cat} className="category-chip glass">
                                <span>{cat}</span>
                                <button type="button" onClick={() => removeCategory(cat)} title="Remove">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="save-profile-btn mt-6 w-full"
                        onClick={handleProfileSave}
                    >
                        Save Categories
                    </button>
                </div>

                {/* Data Management Section */}
                <div className="settings-card glass">
                    <h2 className="settings-section-title">
                        <Shield size={20} className="text-primary" /> Data Management
                    </h2>
                    <div className="data-actions">
                        <button className="data-btn" onClick={exportData}>
                            <Download size={18} />
                            <span>Export Data (.json)</span>
                        </button>

                        <label className="data-btn cursor-pointer">
                            <Upload size={18} />
                            <span>Import Data</span>
                            <input type="file" accept=".json" hidden onChange={handleImport} />
                        </label>

                        <button className="data-btn" onClick={seedDefaultData}>
                            <Upload size={18} />
                            <span>Seed Default Data</span>
                        </button>

                        <button className="data-btn danger" onClick={resetData}>
                            <RefreshCw size={18} />
                            <span>Reset All Data</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
