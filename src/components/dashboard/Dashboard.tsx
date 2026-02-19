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
    CartesianGrid,
    AreaChart,
    Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const DashboardLayout: React.FC = () => {
    const {
        transactions,
        installments,
        totalBalance,
        totalIncome,
        totalExpense,
        safeBalance,
        setIsFormOpen,
        setEditingTransaction,
        currencySymbol: symbol,
        loading,
        needsSync,
        syncLocalToCloud
    } = useTransactions();
    const { user } = useAuth();
    const navigate = useNavigate();

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
            .reduce((acc: any, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => (b.value as number) - (a.value as number))
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

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] premium-dashboard">
                <div className="text-center p-8 glass rounded-[32px] border border-primary/20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4 mx-auto"></div>
                    <p className="text-primary font-bold tracking-widest uppercase text-xs">Accessing Vault...</p>
                    <p className="text-muted text-sm mt-2">Drying up the blood ink...</p>
                </div>
            </div>
        );
    }

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
                        <Plus size={18} /> <span>Add Transaction</span>
                    </button>

                </header>

                {/* Cloud Sync Alert */}
                {needsSync && (
                    <div className="premium-card col-span-full border-primary/40 bg-primary/5 flex items-center justify-between p-4 mb-6 animate-pulse-subtle">
                        <div className="flex items-center gap-3">
                            <Shield className="text-primary" size={20} />
                            <div>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">Local Data Detected</p>
                                <p className="text-[11px] text-muted">Your latest transactions are currently only on this device. Sync to Vault to access them everywhere.</p>
                            </div>
                        </div>
                        <button
                            className="bg-primary hover:bg-primary-hover text-bg-main px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            onClick={syncLocalToCloud}
                        >
                            Sync to Vault
                        </button>
                    </div>
                )}

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
                <div className="premium-card goals-card" onClick={() => navigate('/installments')} style={{ cursor: 'pointer' }}>
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title">Live Goals</h3>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70">Details</button>
                    </div>
                    <div className="goals-mini-list mt-8 flex flex-col gap-8">
                        {installments.length > 0 ? installments.slice(0, 4).map(inst => {
                            const paidPercent = Math.round((inst.paidMonths / inst.tenure) * 100);
                            const sparkData = [
                                { v: 10 },
                                { v: paidPercent * 0.4 },
                                { v: paidPercent * 0.7 },
                                { v: paidPercent }
                            ];

                            return (
                                <div key={inst.id} className="goal-row group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="max-w-[50%]">
                                            <p className="text-[11px] font-black text-primary/60 uppercase tracking-widest leading-none mb-1.5">{inst.category}</p>
                                            <h4 className="text-sm font-black text-text-primary group-hover:text-primary transition-colors truncate">{inst.name}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-text-primary leading-none mb-1">{paidPercent}%</p>
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">{inst.paidMonths}/{inst.tenure} MO</p>
                                        </div>
                                    </div>

                                    <div className="h-10 w-full relative mt-1">
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={sparkData}>
                                                    <defs>
                                                        <linearGradient id={`grad-${inst.id}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Area
                                                        type="monotone"
                                                        dataKey="v"
                                                        stroke="var(--primary)"
                                                        strokeWidth={2}
                                                        fill={`url(#grad-${inst.id})`}
                                                        isAnimationActive={true}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="progress-bar-bg h-[3px] absolute bottom-0 left-0 right-0 bg-white/5 overflow-hidden">
                                            <div
                                                className="progress-bar-fill h-full bg-primary shadow-[0_0_8px_var(--primary)]"
                                                style={{ width: `${paidPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8 glass rounded-2xl border border-dashed border-white/10">
                                <p className="text-xs text-muted font-bold uppercase tracking-widest">No active installments</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="premium-card performance-card">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title">Monthly Performance</h3>
                    </div>
                    <div className="h-full flex flex-col pt-4 overflow-hidden">
                        <div className="chart-wrapper performance-chart">
                            {hasMonthlyData ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            contentStyle={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                            }}
                                        />
                                        <Bar
                                            dataKey="income"
                                            fill="var(--secondary)"
                                            radius={[4, 4, 0, 0]}
                                            barSize={20}
                                        />
                                        <Bar
                                            dataKey="expense"
                                            fill="var(--primary)"
                                            radius={[4, 4, 0, 0]}
                                            barSize={20}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted text-sm">
                                    No transaction data for the last 6 months
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spending Analytics (New Card) */}
                <div className="premium-card market-bar">
                    <div className="card-header">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">
                            <PieIcon size={12} className="text-primary" /> Category Distribution
                        </div>
                    </div>
                    <div className="flex gap-8 items-center mt-4 spending-analytics-wrapper">
                        <div style={{ height: '100%', width: '100%', flex: 1.2, minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="65%"
                                        outerRadius="90%"
                                        paddingAngle={6}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}44)` }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            boxShadow: 'var(--shadow-glow)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex-1 flex flex-col gap-3 pr-2">
                            {categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                                            style={{
                                                backgroundColor: COLORS[index % COLORS.length],
                                                boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}66`
                                            }}
                                        ></div>
                                        <span className="text-[11px] font-bold text-text-secondary group-hover:text-primary transition-colors">
                                            {entry.name}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-black text-primary">
                                        {Math.round(((entry.value as number) / (categoryData.reduce((acc, b) => acc + (b.value as number), 0) || 1)) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="premium-card history-card">
                    <div className="card-header flex justify-between items-center mb-6">
                        <h3 className="card-title">Recent Activity</h3>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70" onClick={() => navigate('/market')}>View All</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {recentTransactions.map(tx => (
                            <div key={tx.id} className="history-item glass p-4 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                        {tx.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold">{tx.title}</h4>
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

export default DashboardLayout;
