import React, { useState } from 'react';
import { User, Shield, Download, Upload, RefreshCw, Palette, Check, Coins, Tag, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import './Settings.css';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const { transactions, deleteTransaction } = useTransactions();

    const [profile, setProfile] = useState({
        firstName: localStorage.getItem('user_firstName') || '',
        lastName: localStorage.getItem('user_lastName') || '',
        phone: localStorage.getItem('user_phone') || ''
    });

    const [preferences, setPreferences] = useState({
        currency: localStorage.getItem('pref_currency') || 'INR',
        monthlyBudget: localStorage.getItem('pref_monthlyBudget') || '50000'
    });

    const [categories, setCategories] = useState<string[]>(() => {
        const saved = localStorage.getItem('pref_categories');
        return saved ? JSON.parse(saved) : [
            'Food & Drinks', 'Shopping', 'Housing', 'Transportation',
            'Entertainment', 'Salary', 'Investment', 'Others'
        ];
    });

    const [newCategory, setNewCategory] = useState('');

    const themes: { id: any, name: string, color: string }[] = [
        { id: 'dark', name: 'Obsidian', color: '#0c0a09' },
        { id: 'light', name: 'Stone', color: '#fafaf9' },
        { id: 'emerald', name: 'Emerald', color: '#064e3b' },
        { id: 'rose', name: 'Rose', color: '#4c0519' },
        { id: 'ocean', name: 'Ocean', color: '#083344' }
    ];

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('user_firstName', profile.firstName);
        localStorage.setItem('user_lastName', profile.lastName);
        localStorage.setItem('user_phone', profile.phone);
        localStorage.setItem('pref_currency', preferences.currency);
        localStorage.setItem('pref_monthlyBudget', preferences.monthlyBudget);
        localStorage.setItem('pref_categories', JSON.stringify(categories));
        alert('Profile and preferences updated successfully!');
        window.location.reload(); // Refresh to apply currency changes everywhere
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const removeCategory = (cat: string) => {
        setCategories(categories.filter(c => c !== cat));
    };

    const exportData = () => {
        const dataStr = JSON.stringify(transactions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `fintrack_data_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const resetData = async () => {
        if (window.confirm('Are you sure you want to delete ALL transactions? This cannot be undone.')) {
            // In a better implementation, we'd have a batch delete in TransactionContext
            for (const t of transactions) {
                await deleteTransaction(t.id);
            }
            alert('All data has been reset.');
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                console.log('Imported data:', imported);
                alert('Import functionality requires backend batch support. Files are parsed, but individual adding is pending.');
            } catch (err) {
                alert('Invalid JSON file.');
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
                        <div className="flex gap-4">
                            <div className="settings-input-group flex-1">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={profile.firstName}
                                    onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                    placeholder="Sanmaya"
                                />
                            </div>
                            <div className="settings-input-group flex-1">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={profile.lastName}
                                    onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                    placeholder="MB"
                                />
                            </div>
                        </div>
                        <div className="settings-input-group">
                            <label>Email Address (Managed by Firebase)</label>
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
                            onChange={e => setPreferences({ ...preferences, currency: e.target.value })}
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
