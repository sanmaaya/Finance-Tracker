import React from 'react';
import { Zap, Calendar, PieChart, Clock, Plus, Smartphone, Car, Gamepad2, Home, Trash2, Edit2, ShieldCheck, TrendingUp } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../hooks/useTheme';
import './Installments.css';

const Installments = () => {
    const {
        installments,
        setIsInstallmentFormOpen,
        currencySymbol: symbol,
        deleteInstallment,
        setEditingInstallment,
        safeBalance
    } = useTransactions();
    const { theme, isLight } = useTheme();

    const debts = installments.filter(i => i.type === 'debt');
    const totalMonthlyEmi = debts.reduce((sum, item) => sum + item.monthlyEmi, 0);
    const totalRemainingDebt = debts.reduce((sum, item) => sum + (item.totalAmount - (item.monthlyEmi * item.paidMonths)), 0);

    const handleEdit = (item) => {
        setEditingInstallment(item);
        setIsInstallmentFormOpen(true);
    };

    const getIcon = (category) => {
        const style = { color: theme.accent };
        switch (category) {
            case 'Electronics': return <Smartphone size={20} style={style} />;
            case 'Transport': return <Car size={20} style={style} />;
            case 'Life': return <Gamepad2 size={20} style={style} />;
            case 'Health': return <Home size={20} style={style} />;
            default: return <Zap size={20} style={style} />;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Dissolve this strategic plan?')) {
            await deleteInstallment(id);
        }
    };

    const cardStyle = {
        background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "28px",
        boxShadow: isLight ? "0 10px 30px rgba(0,0,0,0.05)" : "0 10px 30px rgba(0,0,0,0.2)",
        transition: "all 0.3s", position: "relative", overflow: "hidden"
    };

    return (
        <div style={{ padding: "40px 24px", minHeight: "100vh", position: "relative" }}>
            <div style={{ maxWidth: 1240, margin: "0 auto" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
                    <div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: theme.text, letterSpacing: "-1px" }}>Strategic <span style={{ color: theme.accent }}>Vault</span></h1>
                        <p style={{ color: theme.textMuted, fontSize: "1rem", marginTop: 8 }}>Orchestrate your long-term capital flows.</p>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ padding: "12px 20px", background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, textAlign: "right" }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Monthly Commitment</div>
                            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: theme.accent }}>{symbol}{totalMonthlyEmi.toLocaleString()}</div>
                        </div>
                        <button onClick={() => { setEditingInstallment(null); setIsInstallmentFormOpen(true); }} style={{
                            padding: "14px 24px", borderRadius: 16, background: theme.accent, color: isLight ? "#fff" : theme.bg, border: "none", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s"
                        }} className="btn-save-lux">
                            <Plus size={20} /> New Strategy
                        </button>
                    </div>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, color: theme.textMuted, marginBottom: 8 }}>
                            <Clock size={18} />
                            <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2 }}>Operational Matrix ({installments.length})</span>
                        </div>

                        {installments.length === 0 ? (
                            <div style={{ ...cardStyle, textAlign: "center", padding: "80px 40px", borderStyle: "dashed" }}>
                                <p style={{ color: theme.textMuted, fontSize: "1.1rem" }}>No active strategic plans found in the vault.</p>
                                <button onClick={() => setIsInstallmentFormOpen(true)} style={{ color: theme.accent, fontWeight: 800, marginTop: 16, background: "none", border: "none", cursor: "pointer" }}>Initiate First Capture →</button>
                            </div>
                        ) : (
                            installments.map((item) => (
                                <div key={item.id} style={cardStyle} className="installment-card-lux">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16 }}>
                                        <div style={{ display: "flex", gap: 20 }}>
                                            <div style={{ width: 52, height: 52, borderRadius: 14, background: theme.surface, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {getIcon(item.category)}
                                            </div>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>{item.name}</h3>
                                                    <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 800, background: item.type === 'goal' ? `${theme.pos}15` : `${theme.neg}15`, color: item.type === 'goal' ? theme.pos : theme.neg }}>
                                                        {item.type === 'goal' ? 'SAVINGS GOAL' : 'DEBT OBLIGATION'}
                                                    </span>
                                                    <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 800, background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.border}` }}>{item.category}</span>
                                                </div>
                                                <div style={{ display: "flex", gap: 16, fontSize: "0.75rem", color: theme.textMuted, fontWeight: 600 }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> Latency: {item.startDate}</span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><PieChart size={14} /> Progress: {item.paidMonths} / {item.tenure} Phases</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: item.type === 'goal' ? theme.pos : theme.text }}>{symbol}{item.monthlyEmi.toLocaleString()}</div>
                                            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{item.type === 'goal' ? 'Monthly Allocation' : 'Monthly Outflow'}</div>
                                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }} className="actions-lux">
                                                <button onClick={() => handleEdit(item)} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", padding: 4 }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", color: theme.neg, cursor: "pointer", padding: 4, opacity: 0.6 }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ height: 8, background: theme.surface, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                                        <div style={{
                                            height: "100%", width: `${(item.paidMonths / item.tenure) * 100}%`,
                                            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2 || theme.purp})`,
                                            borderRadius: 4, transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
                                        }} />
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: theme.textMuted, fontWeight: 700 }}>
                                        <span>Capital Retained: <span style={{ color: theme.text }}>{symbol}{(item.monthlyEmi * item.paidMonths).toLocaleString()}</span></span>
                                        <span>Remaining Exposure: <span style={{ color: theme.text }}>{symbol}{(item.totalAmount - (item.monthlyEmi * item.paidMonths)).toLocaleString()}</span></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${theme.card}, ${theme.surface})` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                <ShieldCheck size={20} style={{ color: theme.accent }} />
                                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text, textTransform: "uppercase", letterSpacing: 1 }}>Vault Summary</h2>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                <div>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase" }}>Strategic Reserve</div>
                                    <div style={{ fontSize: "2rem", fontWeight: 900, color: theme.pos }}>{symbol}{safeBalance.toLocaleString()}</div>
                                </div>
                                <div style={{ height: 1, background: theme.border }} />
                                <div>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase" }}>Total Liabilities</div>
                                    <div style={{ fontSize: "2rem", fontWeight: 900, color: theme.neg }}>{symbol}{totalRemainingDebt.toLocaleString()}</div>
                                </div>
                                <div style={{ marginTop: 12, padding: 16, borderRadius: 16, background: `${theme.accent}10`, display: "flex", alignItems: "center", gap: 12 }}>
                                    <TrendingUp size={20} style={{ color: theme.accent }} />
                                    <span style={{ fontSize: "0.8rem", color: theme.text, fontWeight: 600 }}>Your net liquidity position is {(safeBalance - totalRemainingDebt) > 0 ? "Positive" : "Negative"}.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .installment-card-lux:hover { transform: translateY(-4px); border-color: ${theme.accent}50 !important; }
                .btn-save-lux:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 8px 20px ${theme.accent}40; }
                .actions-lux button:hover { color: ${theme.accent} !important; opacity: 1 !important; transform: scale(1.1); transition: all 0.2s; }
            `}</style>
        </div>
    );
};

export default Installments;
