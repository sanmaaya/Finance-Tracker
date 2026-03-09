import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, PieChart, Info, CheckCircle2 } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../hooks/useTheme';
import './InstallmentForm.css';

const InstallmentForm = ({ onClose }) => {
    const { addInstallment, updateInstallment, currencySymbol, editingInstallment, setEditingInstallment } = useTransactions();
    const { theme, isLight } = useTheme();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        totalAmount: '',
        monthlyEmi: '',
        tenure: '',
        paidMonths: '0',
        startDate: new Date().toISOString().split('T')[0],
        category: 'Electronics',
        type: 'debt'
    });

    useEffect(() => {
        if (editingInstallment) {
            setFormData({
                name: editingInstallment.name,
                totalAmount: editingInstallment.totalAmount.toString(),
                monthlyEmi: editingInstallment.monthlyEmi.toString(),
                tenure: editingInstallment.tenure.toString(),
                paidMonths: editingInstallment.paidMonths.toString(),
                startDate: editingInstallment.startDate,
                category: editingInstallment.category,
                type: editingInstallment.type || 'debt'
            });
        }
    }, [editingInstallment]);

    const categories = ['Electronics', 'Transport', 'Life', 'Health', 'Subscription', 'Education', 'Others'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const installmentData = {
                name: formData.name,
                totalAmount: Number(formData.totalAmount),
                monthlyEmi: Number(formData.monthlyEmi),
                tenure: Number(formData.tenure),
                paidMonths: Number(formData.paidMonths),
                startDate: formData.startDate,
                category: formData.category,
                type: formData.type
            };
            if (editingInstallment) {
                await updateInstallment(editingInstallment.id, installmentData);
            } else {
                await addInstallment(installmentData);
            }
            handleClose();
        } catch (error) {
            console.error("Error processing installment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEditingInstallment(null);
        onClose();
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
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${theme.accent}, ${theme.purp})` }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: theme.text }}>{editingInstallment ? 'Refine Plan' : 'Strategic Growth'}</h3>
                    <p style={{ fontSize: "0.8rem", color: theme.textMuted, marginTop: 4 }}>Design your long-term financial structure.</p>
                </div>
                <button onClick={handleClose} style={{
                    width: 36, height: 36, borderRadius: "50%", background: theme.surface, border: `1px solid ${theme.border}`,
                    color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s"
                }} className="close-btn-hover"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 12, background: theme.surface, padding: 4, borderRadius: 14, border: `1px solid ${theme.border}` }}>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'debt' })} style={{
                        flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, transition: "all 0.3s",
                        background: formData.type === 'debt' ? (isLight ? theme.neg : `${theme.neg}30`) : "transparent",
                        color: formData.type === 'debt' ? (isLight ? "#fff" : theme.neg) : theme.textMuted
                    }}>EMI / Debt</button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'goal' })} style={{
                        flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, transition: "all 0.3s",
                        background: formData.type === 'goal' ? (isLight ? theme.pos : `${theme.pos}30`) : "transparent",
                        color: formData.type === 'goal' ? (isLight ? "#fff" : theme.pos) : theme.textMuted
                    }}>Savings Goal</button>
                </div>

                <div style={{ position: "relative" }}>
                    <Tag size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="Project Name (e.g. Dream House)"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                        <DollarSign size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder={"Total Cost (" + currencySymbol + ")"}
                            value={formData.totalAmount}
                            onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <PieChart size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder={"Monthly Step (" + currencySymbol + ")"}
                            value={formData.monthlyEmi}
                            onChange={e => setFormData({ ...formData, monthlyEmi: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                        <Calendar size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="Duration (Months)"
                            value={formData.tenure}
                            onChange={e => setFormData({ ...formData, tenure: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <Info size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="Steps Taken"
                            value={formData.paidMonths}
                            onChange={e => setFormData({ ...formData, paidMonths: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                        <Tag size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <select
                            style={{ ...inputStyle, appearance: "none" }}
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ position: "relative" }}>
                        <Calendar size={18} style={{ position: "absolute", left: 14, top: 14, color: theme.textMuted }} />
                        <input
                            style={inputStyle}
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} style={{
                    width: "100%", padding: "14px", borderRadius: 14, border: "none", background: theme.accent, color: isLight ? "#fff" : theme.bg,
                    fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.3s", marginTop: 8, boxShadow: isLight ? `0 10px 20px ${theme.accent}30` : "none"
                }} className="btn-save-lux">
                    {loading ? 'Archiving...' : (
                        <>
                            <CheckCircle2 size={18} />
                            {editingInstallment ? 'Finalize Changes' : 'Launch Plan'}
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

export default InstallmentForm;
