import React, { useMemo } from 'react';
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    Shield,
    PieChart as PieIcon
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
import { useTransactions } from '../../context/TransactionContext';
import { useAuth } from '../../context/AuthContext';
import './PremiumDashboard.css';

const PremiumDashboard: React.FC = () => {
    const {
        transactions,
        installments,
        totalBalance,
        totalIncome,
        totalExpense,
        safeBalance,
        setIsFormOpen,
        setEditingTransaction,
        currencySymbol: symbol
    } = useTransactions();
    const { user } = useAuth();

    const parseDate = (date: any): Date => {
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
        interface MonthData {
            name: string;
            income: number;
            expense: number;
            month: number;
            year: number;
        }
        const last6Months: MonthData[] = [];
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

    const hasMonthlyData = useMemo(() =>
        monthlyData.some(d => d.income > 0 || d.expense > 0),
        [monthlyData]);

    const recentTransactions = transactions.slice(0, 6);

    const categoryData = useMemo(() => {
        const categoryMap = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const amount = Number(t.amount) || 0;
                acc[t.category] = (acc[t.category] || 0) + amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [transactions]);

    const COLORS = ['#7c3af2', '#2cd1c1', '#f59e0b', '#10b981', '#ef4444'];

    const formatTimeAgo = (date: any) => {
        if (!date) return 'Some time ago';
        const d = parseDate(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="premium-dashboard">
            <div className="dashboard-layout">
                {/* Header Area */}
                <header className="dashboard-header">
                    <div className="breadcrumb-trail">
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-1">Financial Overview</p>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Hey, <span className="text-gradient">{user?.displayName?.split(' ')[0] || 'User'}</span>! 👋
                        </h1>
                    </div>
                    <button className="add-transaction-btn" onClick={handleAddTransaction}>
                        <Plus size={18} /> Add Transaction
                    </button>

                </header>

                {/* Stats Section (2x2) */}
                <div className="stats-grid">
                    <div className="mini-stat-card total-balance">
                        <div className="stat-icon text-primary"><Wallet size={20} /></div>
                        <div>
                            <p className="stat-label">Total balance</p>
                            <h2 className="stat-value">{symbol}{totalBalance.toLocaleString()}</h2>
                        </div>
                    </div>
                    <div className="mini-stat-card">
                        <div className="stat-icon text-secondary"><ArrowUpCircle size={20} /></div>
                        <div>
                            <p className="stat-label">Income</p>
                            <h2 className="stat-value">{symbol}{totalIncome.toLocaleString()}</h2>
                        </div>
                    </div>
                    <div className="mini-stat-card">
                        <div className="stat-icon text-rose-500"><ArrowDownCircle size={20} /></div>
                        <div>
                            <p className="stat-label">Expense</p>
                            <h2 className="stat-value">{symbol}{totalExpense.toLocaleString()}</h2>
                        </div>
                    </div>
                    <div className="mini-stat-card safe-account">
                        <div className="stat-icon text-emerald-500"><Shield size={20} /></div>
                        <div>
                            <p className="stat-label">Safe Account</p>
                            <h2 className="stat-value">{symbol}{safeBalance.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>


                {/* Goals Card (Connected to Installments) */}
                <div className="premium-card goals-card" onClick={() => window.location.href = '/installments'} style={{ cursor: 'pointer' }}>
                    <div className="card-header">
                        <h3 className="card-title">Live Goals</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            Live
                        </div>
                    </div>
                    <div className="goal-list mt-4 flex flex-col gap-6">
                        {installments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2">No active goals</p>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Setup Plan</button>
                            </div>
                        ) : (
                            installments.slice(0, 3).map((inst) => {
                                const progress = Math.round((inst.paidMonths / inst.tenure) * 100);

                                return (
                                    <div key={inst.id} className="goal-item-small">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-0.5">{inst.category}</p>
                                                <span className="text-sm font-black text-white">{inst.name}</span>
                                            </div>
                                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                            <div
                                                className="h-full transition-all duration-1000 bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Monthly Performance Comparison */}
                <div className="premium-card cashflow-card">
                    <div className="card-header">
                        <h3 className="card-title">Monthly Performance</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Income</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Expense</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-full flex flex-col pt-4">
                        <div className="chart-wrapper" style={{ height: '350px', marginTop: '1.5rem', minWidth: 0 }}>
                            {hasMonthlyData ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#0f1014',
                                                border: '1px solid var(--border)',
                                                borderRadius: '16px',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                            }}
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                                        />
                                        <Bar dataKey="income" fill="#2cd1c1" radius={[6, 6, 0, 0]} barSize={12} />
                                        <Bar dataKey="expense" fill="#7c3af2" radius={[6, 6, 0, 0]} barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted text-sm font-medium">
                                    No monthly data available. Add some transactions!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spending Analytics Graph */}
                <div className="premium-card market-bar">
                    <div className="card-header">
                        <h3 className="card-title">Spending Analytics</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                            <PieIcon size={12} className="text-primary" /> Category Distribution
                        </div>
                    </div>
                    <div className="flex gap-8 items-center h-[280px] mt-4">
                        <div style={{ height: '100%', width: '100%', flex: 1.5, minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#0f1014', border: '1px solid var(--border)', borderRadius: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 flex flex-col gap-3 pr-4">
                            {categoryData.slice(0, 4).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black">{symbol}{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* History Card */}
                <div className="premium-card history-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Activity</h3>
                        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline" onClick={() => window.location.href = '/market'}>View Analytics</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {recentTransactions.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer" onClick={() => { setEditingTransaction(tx); setIsFormOpen(true); }}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                        {tx.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black truncate">{tx.title}</p>
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{tx.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-black ${tx.type === 'income' ? 'text-secondary' : 'text-primary'}`}>
                                        {tx.type === 'income' ? '+' : '-'}{symbol}{tx.amount.toLocaleString()}
                                    </span>
                                    <p className="text-[9px] text-muted font-medium">{formatTimeAgo(tx.date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Floating Action Button */}
            <div className="fab-container">
                <button className="fab" onClick={handleAddTransaction} title="Add Transaction">
                    <Plus size={32} />
                </button>
            </div>
        </div>
    );
};

export default PremiumDashboard;
