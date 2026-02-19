import React, { useMemo, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import {
    PieChart as PieIcon,
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
    CartesianGrid,
    Legend
} from 'recharts';
import TransactionList from '../components/transactions/TransactionList';
import './Market.css';

const Market: React.FC = () => {
    const {
        transactions,
        currencySymbol: symbol,
        setIsFormOpen,
        setEditingTransaction
    } = useTransactions();

    const [activeTab, setActiveTab] = useState<'spending' | 'income'>('spending');

    const parseDate = (date: any): Date => {
        if (!date) return new Date();
        if (typeof date.toDate === 'function') return date.toDate();
        if (date.seconds !== undefined) return new Date(date.seconds * 1000);
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    const handleEdit = (tx: any) => {
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
            }, {} as Record<string, number>);

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
            if (date.getFullYear() === currentYear) {
                const monthIdx = date.getMonth();
                if (t.type === 'income') data[monthIdx].income += t.amount;
                else data[monthIdx].expense += t.amount;
            }
        });

        return data;
    }, [transactions]);

    const COLORS = ['#7c3af2', '#2cd1c1', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9'];

    return (
        <div className="market-page">
            <header className="market-header-refined">
                <div>
                    <h1 className="market-title">Spending Analytics</h1>
                    <p className="market-subtitle">Deep dive into your financial patterns</p>
                </div>
                <div className="analytics-actions">
                    <div className="analytics-toggle glass">
                        <button
                            className={`toggle-btn ${activeTab === 'spending' ? 'active' : ''}`}
                            onClick={() => setActiveTab('spending')}
                        >
                            Expenses
                        </button>
                        <button
                            className={`toggle-btn ${activeTab === 'income' ? 'active' : ''}`}
                            onClick={() => setActiveTab('income')}
                        >
                            Income
                        </button>
                    </div>
                </div>
            </header>

            <div className="analytics-layout">
                {/* Main Distribution Chart */}
                <div className="premium-card chart-main-card">
                    <div className="card-header">
                        <h3 className="card-title">Monthly Cashflow Trend</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                            <Activity size={12} className="text-secondary" /> Annual Performance
                        </div>
                    </div>
                    <div className="chart-wrapper" style={{ height: '350px', marginTop: '1.5rem', minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-primary)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                <Bar dataKey="income" name="Income" fill="#2cd1c1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name="Expense" fill="#7c3af2" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown Sidebar */}
                <div className="premium-card chart-side-card">
                    <div className="card-header">
                        <h3 className="card-title">Category Share</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                            <PieIcon size={12} className="text-primary" /> Breakdown
                        </div>
                    </div>
                    <div className="chart-wrapper" style={{ height: '280px', marginTop: '1rem', minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex flex-col gap-4">
                        {categoryData.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-xs font-bold text-muted truncate max-w-[120px]">{item.name}</span>
                                </div>
                                <span className="text-sm font-black">{symbol}{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction History Full List */}
                <div className="history-full-area">
                    <TransactionList onEdit={handleEdit} />
                </div>
            </div>
        </div>
    );
};

export default Market;
