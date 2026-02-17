import React from 'react';
import SummaryCards from '../components/dashboard/SummaryCards';
import TransactionList from '../components/transactions/TransactionList';
import { useTransactions, type Transaction } from '../context/TransactionContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { } from 'lucide-react'; // Removing specific unused imports to clean up
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const {
        transactions,
        totalBalance,
        totalIncome,
        totalExpense,
        setIsFormOpen,
        setEditingTransaction
    } = useTransactions();

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };



    // Prepare data for Area Chart (last 7 days - simplified)
    const chartData = [
        { name: 'Mon', income: 4000, expense: 2400 },
        { name: 'Tue', income: 3000, expense: 1398 },
        { name: 'Wed', income: 2000, expense: 9800 },
        { name: 'Thu', income: 2780, expense: 3908 },
        { name: 'Fri', income: 1890, expense: 4800 },
        { name: 'Sat', income: 2390, expense: 3800 },
        { name: 'Sun', income: 3490, expense: 4300 },
    ];

    // Prepare data for Pie Chart (Category-wise)
    const pieData = Object.entries(
        transactions.reduce((acc, curr) => {
            if (curr.type === 'expense') {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            }
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899'];

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const topCategory = pieData.length > 0
        ? pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
        : 'None';

    const currency = localStorage.getItem('pref_currency') || 'INR';
    const currencySymbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const symbol = currencySymbols[currency] || '₹';

    const monthlyBudget = parseFloat(localStorage.getItem('pref_monthlyBudget') || '50000');
    const leftToSpend = monthlyBudget - totalExpense;
    const spendPercentage = Math.min((totalExpense / monthlyBudget) * 100, 100);
    const isOverBudget = totalExpense > monthlyBudget;

    return (
        <div className="dashboard-page container">
            <div className="dashboard-header mb-6">
                <h1 className="welcome-text">Financial Overview</h1>
                <p className="subtitle text-sm">Track your spending and save more effectively.</p>
            </div>

            <SummaryCards
                totalBalance={totalBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
            />

            <div className="overview-stack mt-8 mb-10">
                {/* Toshl-inspired Monthly Overview */}
                <div className="toshl-overview glass mb-6">
                    <div className="toshl-header flex justify-between items-center mb-1">
                        <span className="toshl-label text-[10px]">Monthly Budget</span>
                        <div className={`toshl-left-to-spend ${isOverBudget ? 'over' : ''}`}>
                            <h2 className="left-amount text-xl inline-block mr-2">{symbol}{Math.abs(leftToSpend).toLocaleString()}</h2>
                            <span className="left-text text-[10px]">{isOverBudget ? 'Over' : 'Left'}</span>
                        </div>
                    </div>

                    <div className="toshl-progress-container my-2">
                        <div className="toshl-progress-bar h-1.5">
                            <div
                                className={`toshl-progress-fill ${isOverBudget ? 'danger' : ''}`}
                                style={{ width: `${spendPercentage}%` }}
                            ></div>
                        </div>
                        <div className="toshl-progress-labels text-[9px]">
                            <span>{symbol}0</span>
                            <div className="toshl-stats flex gap-4">
                                <span>Used: {symbol}{totalExpense.toLocaleString()}</span>
                                <span>Limit: {symbol}{monthlyBudget.toLocaleString()}</span>
                            </div>
                            <span>{symbol}{monthlyBudget.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="hero-section glass flex items-center justify-between overflow-hidden">
                    <div className="hero-content">
                        <h1 className="hero-title text-2xl">Track your {currentMonth} spending.</h1>
                        <p className="hero-subtitle text-sm">
                            Personalized insights to help you manage your money habbits better.
                        </p>
                        <div className="hero-cta flex gap-3 mt-4">
                            <button className="hero-btn primary py-2 px-5 text-sm">View Insights</button>
                            <button className="hero-btn secondary py-2 px-5 text-sm">Analysis</button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="mini-dashboard glass scale-75 origin-right">
                            <div className="mini-header">
                                <span className="mini-month">{currentMonth} Spending</span>
                                <h2 className="mini-total text-xl">{symbol}{totalExpense.toLocaleString()}</h2>
                            </div>
                            <div className="mini-chart h-12">
                                {pieData.map((data, i) => (
                                    <div key={i} className="mini-bar" style={{
                                        height: `${(data.value / totalExpense) * 100}%`,
                                        background: COLORS[i % COLORS.length]
                                    }}></div>
                                ))}
                            </div>
                            <div className="mini-footer">
                                <span className="mini-label text-xs">Top: {topCategory}</span>
                            </div>
                        </div>
                        <div className="hero-circle-gradient"></div>
                    </div>
                </div>
            </div>

            <div className="charts-grid mb-8">
                <div className="chart-container glass">
                    <h3 className="chart-title">Cash Flow</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container glass">
                    <h3 className="chart-title">Spending Categories</h3>
                    <div className="pie-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData.length > 0 ? pieData : [{ name: 'No data', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1 }]).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={pieData.length > 0 ? COLORS[index % COLORS.length] : 'rgba(255,255,255,0.1)'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="chart-center-text"
                                    fill="white"
                                >
                                    {symbol}{totalExpense.toLocaleString()}
                                </text>
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '30px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <TransactionList onEdit={handleEdit} />

        </div>
    );
};

export default Dashboard;
