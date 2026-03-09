import React, { useMemo, useState, useEffect } from 'react';
import {
    Plus,
    TrendingDown,
    Shield,
    Gem,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import QuickAdd from './QuickAdd';
import './Dashboard.css';

const StatCard = ({ theme, icon, label, value, sub, color, delay, isLight, onClick }) => {
    const [vis, setVis] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);

    // Split value into symbol and number for better font handling
    const symbolMatch = String(value).match(/^([^0-9,. ]+)(.*)$/);
    const symbol = symbolMatch ? symbolMatch[1] : '';
    const amount = symbolMatch ? symbolMatch[2] : value;

    return (
        <div className="card-hover-new" style={{
            background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20,
            padding: "24px 22px", position: "relative", overflow: "hidden", cursor: onClick ? 'pointer' : 'default',
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            boxShadow: isLight ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
        }} onClick={onClick}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.08, filter: "blur(20px)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: "1.4rem" }}>{icon}</div>
                <div style={{ fontSize: "0.7rem", color: sub?.startsWith("+") ? theme.pos : theme.neg, fontWeight: 700, background: sub?.startsWith("+") ? `${theme.pos}18` : `${theme.neg}18`, padding: "3px 9px", borderRadius: 20 }}>{sub}</div>
            </div>
            <div style={{ fontSize: "0.75rem", color: theme.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 900, color: color, display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "sans-serif", fontSize: "1.3rem", marginRight: 4, opacity: 0.8 }}>{symbol}</span>
                <span style={{ fontFamily: "'Playfair Display',serif" }}>{amount}</span>
            </div>
        </div>
    );
};

const DashboardLayout = () => {
    const { theme, isLight } = useTheme();
    const {
        transactions,
        installments,
        totalBalance,
        totalIncome,
        totalExpense,
        setIsFormOpen,
        setEditingTransaction,
        currencySymbol: symbol,
        loading,
        needsSync,
        syncLocalToCloud
    } = useTransactions();
    const { user } = useAuth();
    const navigate = useNavigate();

    const parseDate = (date) => {
        if (!date) return new Date();
        if (typeof date.toDate === 'function') return date.toDate();
        if (date.seconds !== undefined) return new Date(date.seconds * 1000);
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setIsFormOpen(true);
    };

    const monthlyData = useMemo(() => {
        const last6Months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                name: d.toLocaleString('default', { month: 'short' }),
                income: 0,
                expense: 0,
                month: d.getMonth(),
                year: d.getFullYear()
            });
        }

        transactions.forEach(t => {
            const date = parseDate(t.date);
            const m = date.getMonth();
            const y = date.getFullYear();
            const monthData = last6Months.find(d => d.month === m && d.year === y);
            if (monthData) {
                if (t.type === 'income') monthData.income += t.amount;
                else monthData.expense += t.amount;
            }
        });

        return last6Months;
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 6);

    const categoryData = useMemo(() => {
        const categoryMap = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [transactions]);

    const formatTimeAgo = (date) => {
        if (!date) return 'Some time ago';
        const d = parseDate(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] premium-dashboard">
                <div className="text-center p-8 glass rounded-[32px] border border-primary/20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4 mx-auto"></div>
                    <p className="text-primary font-bold tracking-widest uppercase text-xs">Getting things ready...</p>
                    <p className="text-muted text-sm mt-2">Putting your coins in the jar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="premium-dashboard" style={{ background: theme.bg, minHeight: '100vh', transition: 'background 0.5s ease' }}>
            <div className="dashboard-layout" style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 24px 40px' }}>
                <header className="dashboard-header" style={{ animation: "fadeInUp 0.6s ease", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <button className="add-btn-lux" onClick={handleAddTransaction} style={{
                            padding: "14px 28px", borderRadius: 50, border: "none", cursor: "pointer",
                            background: `linear-gradient(135deg, ${theme.accent}, ${theme.orb1 || theme.accent})`,
                            color: isLight ? "#fff" : "#080612", fontWeight: 700, fontSize: "0.9rem",
                            fontFamily: "'DM Sans', sans-serif", boxShadow: `0 8px 24px ${theme.accent}40`,
                            transition: "all 0.3s", display: "flex", alignItems: "center", gap: "8px"
                        }}>
                            <Plus size={18} /> Add Transaction
                        </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: "0.75rem", color: theme.accent, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Overview</div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: theme.text }}>
                            Hi, <span style={{ fontFamily: "System-ui, sans-serif", fontWeight: 600, color: theme.accent }}>{user?.displayName?.split(' ')[0] || 'there'}</span>! 👋
                        </h1>
                        <p style={{ color: theme.textMuted, marginTop: 6, fontSize: "0.9rem" }}>Here&apos;s a look at your money for {new Date().toLocaleString('default', { month: 'long' })}.</p>
                    </div>
                </header>

                {/* Cloud Sync Alert */}
                {needsSync && (
                    <div style={{
                        background: `${theme.accent}12`, border: `1px solid ${theme.borderH}`, borderRadius: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', marginBottom: '28px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${theme.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield className="text-primary" size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.accent, textTransform: 'uppercase', letterSpacing: 1 }}>Save Changes</p>
                                <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>You have some recent activity to save to your cloud account.</p>
                            </div>
                        </div>
                        <button
                            style={{
                                background: theme.accent, color: isLight ? '#fff' : theme.bg, padding: '10px 20px',
                                borderRadius: 12, fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase'
                            }}
                            onClick={syncLocalToCloud}
                        >
                            Sync Now
                        </button>
                    </div>
                )}

                <div className="stats-grid">
                    <StatCard theme={theme} isLight={isLight} icon={<Gem size={22} />} label="Total Balance" value={`${symbol}${totalBalance.toLocaleString()}`} sub="+12.3%" color={theme.accent} delay={0} />
                    <StatCard theme={theme} isLight={isLight} icon={<TrendingUp size={22} />} label="Monthly Income" value={`${symbol}${totalIncome.toLocaleString()}`} sub="+8.1%" color={theme.pos} delay={80} />
                    <StatCard theme={theme} isLight={isLight} icon={<TrendingDown size={22} />} label="Monthly Expense" value={`${symbol}${totalExpense.toLocaleString()}`} sub="-3.2%" color={theme.neg} delay={160} />
                    <StatCard theme={theme} isLight={isLight} icon={<Shield size={22} />} label="Net Savings" value={`${symbol}${(totalIncome - totalExpense).toLocaleString()}`} sub="+22.4%" color={theme.purp} delay={240} />
                </div>


                {/* Content Grid */}
                {/* Performance Chart */}
                <div className="card-hover-new" style={{ gridArea: 'perf', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "24px", boxShadow: isLight ? "0 4px 20px rgba(0,0,0,0.06)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: theme.text }}>Monthly Performance</div>
                            <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: 3 }}>Income vs Expenses</div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            {[{ l: "Income", c: theme.pos }, { l: "Expense", c: theme.neg }].map(l => (
                                <div key={l.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} />
                                    <span style={{ fontSize: "0.7rem", color: theme.textMuted, fontWeight: 600 }}>{l.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ height: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.textMuted, fontSize: 10 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12 }}
                                />
                                <Bar dataKey="income" fill={theme.pos} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" fill={theme.neg} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Goals / Installments */}
                <div className="card-hover-new" onClick={() => navigate('/installments')} style={{ gridArea: 'goals', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "24px", boxShadow: isLight ? "0 4px 20px rgba(0,0,0,0.06)" : "none", cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: theme.text }}>Live Goals</div>
                            <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: 3 }}>Active installments & savings</div>
                        </div>
                        <ChevronRight size={18} style={{ color: theme.accent }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {installments.length > 0 ? installments.slice(0, 3).map((inst) => {
                            const pct = Math.round((inst.paidMonths / inst.tenure) * 100);
                            return (
                                <div key={inst.id}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: "0.8rem", color: theme.text, fontWeight: 600 }}>{inst.name}</span>
                                        <span style={{ fontSize: "0.75rem", color: theme.textMuted }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: `${theme.textMuted}20` }}>
                                        <div style={{
                                            height: "100%", borderRadius: 3, background: theme.accent, width: `${pct}%`,
                                            transition: "width 1s ease", boxShadow: `0 0 8px ${theme.accent}60`
                                        }} />
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: theme.textMuted, fontSize: '0.8rem' }}>No active goals</div>
                        )}
                    </div>
                </div>

                {/* Bottom Row */}
                {/* Recent Transactions */}
                <div style={{ gridArea: 'history', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: theme.text }}>Recent Activities</div>
                        <button onClick={() => navigate('/analytics')} style={{ fontSize: "0.75rem", color: theme.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {recentTransactions.map((t, i) => (
                            <div key={t.id} style={{
                                display: "flex", alignItems: "center", padding: "12px 0",
                                borderBottom: i < recentTransactions.length - 1 ? `1px solid ${theme.border}` : "none"
                            }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.type === 'income' ? `${theme.pos}15` : `${theme.neg}15`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                                    {t.type === 'income' ? <TrendingUp size={18} color={theme.pos} /> : <TrendingDown size={18} color={theme.neg} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: theme.text }}>{t.title}</div>
                                    <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{t.category} · {formatTimeAgo(t.date)}</div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: t.type === 'income' ? theme.pos : theme.neg }}>
                                    {t.type === 'income' ? "+" : "-"}{symbol}{t.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Breakdown */}
                <div style={{ gridArea: 'breakdown', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "24px" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: theme.text, marginBottom: 20 }}>Spending Breakdown</div>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={[theme.accent, theme.pos, theme.purp, '#F59E0B', '#EC4899'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                        {categoryData.slice(0, 4).map((c, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: [theme.accent, theme.pos, theme.purp, '#F59E0B'][i] }} />
                                <span style={{ fontSize: '0.7rem', color: theme.textMuted }}>{c.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={handleAddTransaction}
                className="fab-lux"
                style={{
                    position: "fixed", bottom: 32, right: 32, zIndex: 90,
                    width: 60, height: 60, borderRadius: "50%", border: "none",
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.orb1 || theme.accent})`,
                    color: isLight ? "#fff" : "#080612", fontSize: "1.5rem",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 32px ${theme.accent}50`,
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                +
            </button>
            <style>{`
                .card-hover-new { transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) !important; }
                .card-hover-new:hover { transform: translateY(-5px) !important; box-shadow: 0 12px 30px rgba(0,0,0,0.12) !important; }
                .fab-lux:hover { transform: scale(1.1) rotate(90deg); }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div >
    );
};

export default DashboardLayout;
