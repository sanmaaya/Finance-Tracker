import React, { useMemo, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../hooks/useTheme';
import {
    Activity
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import TransactionList from '../components/transactions/TransactionList';
import './Analytics.css';

const Analytics = () => {
    const {
        transactions,
        currencySymbol: symbol,
        setIsFormOpen,
        setEditingTransaction
    } = useTransactions();
    const { theme, isLight } = useTheme();

    const [activeTab, setActiveTab] = useState('spending');

    const parseDate = (date) => {
        if (!date) return new Date();
        if (typeof date.toDate === 'function') return date.toDate();
        if (date.seconds !== undefined) return new Date(date.seconds * 1000);
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    const handleEdit = (tx) => {
        setEditingTransaction(tx);
        setIsFormOpen(true);
    };

    // Category Distribution Data
    const categoryData = useMemo(() => {
        const type = activeTab === 'spending' ? 'expense' : 'income';
        const map = transactions
            .filter(t => t.type === type)
            .reduce((acc, t) => {
                const amount = Number(t.amount) || 0;
                acc[t.category] = (acc[t.category] || 0) + amount;
                return acc;
            }, {});

        return Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions, activeTab]);

    // Monthly Trend Data
    const monthlyTrend = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        const data = months.map(m => ({ name: m, income: 0, expense: 0 }));

        transactions.forEach(t => {
            const date = parseDate(t.date);
            const amount = Number(t.amount) || 0;
            // Always show data for current and previous year to ensure visuals are populated
            if (date.getFullYear() >= currentYear - 1) {
                const monthIdx = date.getMonth();
                if (t.type === 'income') data[monthIdx].income += amount;
                else data[monthIdx].expense += amount;
            }
        });

        return data;
    }, [transactions]);

    const COLORS = [theme.accent, theme.pos, theme.purp, '#F59E0B', '#EC4899', '#0EA5E9'];

    return (
        <div style={{ background: theme.bg, minHeight: "100vh", padding: "100px 24px 40px", transition: "all 0.5s ease" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <header style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${theme.accent}15`, color: theme.accent, padding: "4px 12px", borderRadius: 50, width: "fit-content", marginBottom: 12 }}>
                            <Activity size={14} />
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Deep Analytics</span>
                        </div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 900, color: theme.text }}>
                            Financial <span style={{ color: theme.accent }}>Patterns</span>
                        </h1>
                        <p style={{ color: theme.textMuted, fontSize: "0.95rem", marginTop: 6 }}>Understand where your money is flowing.</p>
                    </div>

                    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, display: "flex", padding: 4, borderRadius: 14 }}>
                        <button
                            onClick={() => setActiveTab('spending')}
                            style={{
                                padding: "8px 18px", borderRadius: 10, border: "none", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s",
                                background: activeTab === 'spending' ? theme.accent : "transparent",
                                color: activeTab === 'spending' ? (isLight ? "#fff" : theme.bg) : theme.textMuted
                            }}>Expenses</button>
                        <button
                            onClick={() => setActiveTab('income')}
                            style={{
                                padding: "8px 18px", borderRadius: 10, border: "none", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "all 0.3s",
                                background: activeTab === 'income' ? theme.accent : "transparent",
                                color: activeTab === 'income' ? (isLight ? "#fff" : theme.bg) : theme.textMuted
                            }}>Income</button>
                    </div>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 28 }} className="analytics-grid-new">
                    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: theme.text }}>Cashflow History</h3>
                            <div style={{ display: "flex", gap: 12 }}>
                                {[{ l: "Inc", c: theme.pos }, { l: "Exp", c: theme.neg }].map(l => (
                                    <div key={l.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} />
                                        <span style={{ fontSize: "0.7rem", color: theme.textMuted, fontWeight: 600 }}>{l.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.border} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.textMuted, fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.textMuted, fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12 }}
                                    />
                                    <Bar dataKey="income" fill={theme.pos} radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="expense" fill={theme.neg} radius={[4, 4, 0, 0]} barSize={20} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "24px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: theme.text, marginBottom: 20 }}>Top Categories</h3>
                        <div style={{ height: 220 }}>
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
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                            {categoryData.slice(0, 4).map((item, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[index % COLORS.length] }} />
                                        <span style={{ fontSize: "0.8rem", color: theme.textMuted, fontWeight: 600 }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: theme.text }}>{symbol}{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 40, borderTop: `1px solid ${theme.border}`, paddingTop: 40 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${theme.border}` }}>
                            <Activity size={20} color={theme.accent} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>Recent Transactions</h3>
                    </div>
                    <TransactionList onEdit={handleEdit} />
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .analytics-grid-new { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
