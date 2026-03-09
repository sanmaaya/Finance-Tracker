import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../hooks/useTheme';
import { X, DollarSign, Tag, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import './TransactionForm.css';

const TransactionForm = ({ onClose, editData }) => {
    const { addTransaction, updateTransaction } = useTransactions();
    const { theme, isLight } = useTheme();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
    });
    const [submitting, setSubmitting] = useState(false);

    const categories = JSON.parse(localStorage.getItem('pref_categories') || '["Food & Drinks", "Shopping", "Housing", "Transportation", "Entertainment", "Salary", "Investment", "Others"]');

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title,
                amount: String(editData.amount),
                category: editData.category,
                type: editData.type,
                date: editData.date?.toDate
                    ? editData.date.toDate().toISOString().split('T')[0]
                    : new Date(editData.date).toISOString().split('T')[0]
            });
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount || !formData.category) return;

        setSubmitting(true);
        try {
            const data = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                category: formData.category,
                type: formData.type,
                date: new Date(formData.date)
            };
            if (editData) {
                await updateTransaction(editData.id, data);
            } else {
                await addTransaction(data);
            }
            if (onClose) onClose();
        } catch (error) {
            console.error("Error saving transaction:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        width: "100%", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "12px 12px 12px 40px",
        color: theme.text, fontSize: "0.9rem", outline: "none", transition: "all 0.3s", fontWeight: 600
    };

    return (
        <div style={{
            background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "32px", position: "relative",
            boxShadow: isLight ? "0 20px 50px rgba(0,0,0,0.15)" : "0 20px 50px rgba(0,0,0,0.4)", overflow: "hidden"
        }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2 || theme.purp})` }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: theme.text }}>{editData ? 'Adjust Focus' : 'New Transaction'}</h3>
                    <p style={{ fontSize: "0.8rem", color: theme.textMuted, marginTop: 4 }}>Capture your latest financial signal.</p>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{
                        width: 36, height: 36, borderRadius: "50%", background: theme.surface, border: `1px solid ${theme.border}`,
                        color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s"
                    }} className="close-btn-hover"><X size={18} /></button>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", gap: 12, background: theme.surface, padding: 4, borderRadius: 14, border: `1px solid ${theme.border}` }}>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })} style={{
                        flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, transition: "all 0.3s",
                        background: formData.type === 'income' ? (isLight ? theme.pos : `${theme.pos}30`) : "transparent",
                        color: formData.type === 'income' ? (isLight ? "#fff" : theme.pos) : theme.textMuted
                    }}>Income</button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })} style={{
                        flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, transition: "all 0.3s",
                        background: formData.type === 'expense' ? (isLight ? theme.neg : `${theme.neg}30`) : "transparent",
                        color: formData.type === 'expense' ? (isLight ? "#fff" : theme.neg) : theme.textMuted
                    }}>Expense</button>
                </div>

                <div style={{ position: "relative" }}>
                    <FileText size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="What's this for?"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                        <DollarSign size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Calendar size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ position: "relative" }}>
                    <Tag size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                    <select
                        style={{ ...inputStyle, appearance: "none" }}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="" disabled>Focus Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={submitting} style={{
                    width: "100%", padding: "14px", borderRadius: 14, border: "none", background: theme.accent, color: isLight ? "#fff" : theme.bg,
                    fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.3s", marginTop: 8, boxShadow: isLight ? `0 10px 20px ${theme.accent}30` : "none"
                }} className="btn-save-lux">
                    {submitting ? 'Syncing...' : (
                        <>
                            <CheckCircle2 size={18} />
                            {editData ? 'Save Changes' : 'Secure Entry'}
                        </>
                    )}
                </button>
            </form>
            <style>{`
                .close-btn-hover:hover { background: ${theme.neg}15 !important; color: ${theme.neg} !important; border-color: ${theme.neg}30 !important; }
                .btn-save-lux:hover { transform: translateY(-2px); opacity: 0.9; }
                input:focus, select:focus { border-color: ${theme.accent} !important; }
            `}</style>
        </div>
    );
};

export default TransactionForm;
