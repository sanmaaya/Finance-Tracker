import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Zap,
    RefreshCcw,
    Activity,
    BarChart3,
    ArrowRightLeft
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './Market.css';

const Market = () => {
    const { currency, currencySymbol } = useTransactions();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Mock currency data for premium feel
    const mockData = [
        { code: 'USD', name: 'US Dollar', rate: 1.0, change: '+0.12%', trend: 'up' },
        { code: 'EUR', name: 'Euro', rate: 0.92, change: '-0.05%', trend: 'down' },
        { code: 'GBP', name: 'British Pound', rate: 0.79, change: '+0.21%', trend: 'up' },
        { code: 'JPY', name: 'Japanese Yen', rate: 149.50, change: '+0.85%', trend: 'up' },
        { code: 'INR', name: 'Indian Rupee', rate: 82.95, change: '-0.14%', trend: 'down' },
        { code: 'CAD', name: 'Canadian Dollar', rate: 1.35, change: '+0.08%', trend: 'up' },
        { code: 'AUD', name: 'Australian Dollar', rate: 1.53, change: '-0.32%', trend: 'down' },
        { code: 'AED', name: 'UAE Dirham', rate: 3.67, change: '0.00%', trend: 'stable' },
    ];

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setRates(mockData);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const refreshMarket = () => {
        setLoading(true);
        setTimeout(() => {
            setLastUpdated(new Date());
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="market-container">
            <header className="market-page-header">
                <div className="header-content">
                    <div className="badge">
                        <Activity size={12} className="text-secondary" />
                        <span>Real-time Market Data</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">Currency <span className="text-gradient">Market</span></h1>
                    <p className="text-muted">Global exchange insights and live market performance</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="market-status glass p-2 px-4 rounded-xl flex items-center gap-2">
                        <div className="pulse-dot"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Asian Session Open</span>
                    </div>
                    <button className="refresh-btn glass" onClick={refreshMarket} disabled={loading}>
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                        <span>Sync Live</span>
                    </button>
                </div>
            </header>

            <div className="market-overview-row">
                <div className="overview-mini-card glass">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">DXY Index</span>
                        <span className="text-[10px] font-black text-secondary">+0.04%</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black">104.24</span>
                        <TrendingUp size={12} className="text-secondary" />
                    </div>
                </div>
                <div className="overview-mini-card glass">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">EUR/USD</span>
                        <span className="text-[10px] font-black text-primary">-0.12%</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black">1.0824</span>
                        <ArrowDownRight size={12} className="text-primary" />
                    </div>
                </div>
                <div className="overview-mini-card glass">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">GBP/USD</span>
                        <span className="text-[10px] font-black text-secondary">+0.22%</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black">1.2645</span>
                        <ArrowUpRight size={12} className="text-secondary" />
                    </div>
                </div>
                <div className="overview-mini-card glass">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Volatility</span>
                        <span className="text-[10px] font-black text-amber-500">Normal</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black">12.4</span>
                        <BarChart3 size={12} className="text-amber-500" />
                    </div>
                </div>
            </div>

            <div className="market-grid">
                {/* Major Pair Card */}
                <div className="premium-card highlight-card col-span-full">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-5">
                            <div className="market-icon bg-primary/10 text-primary p-4 rounded-[20px] border border-primary/20">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Global Strength Index</p>
                                <h2 className="text-3xl font-black">{currency} <span className="text-muted text-xl font-bold">/ INTERNATIONAL BASKET</span></h2>
                            </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                            <div className="status-pill glass px-3 py-1.5 rounded-full flex items-center gap-2 border-white/5">
                                <div className="pulse-dot"></div>
                                <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Strong Buy</span>
                            </div>
                            <div className="h-10 w-[1px] bg-border mx-2"></div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-secondary">+2.42%</p>
                                <p className="text-[9px] font-black text-muted uppercase tracking-widest">Growth Today</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="h-20 w-full flex items-end gap-1.5">
                            {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75, 60, 85, 95].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-primary/5 to-primary/40 rounded-t-md animate-growth"
                                    style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
                                ></div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">Base Stability Index (BSI)</p>
                            <div className="flex gap-4">
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">Avg. Volatility: 12.4%</p>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">Sentiment: <span className="text-secondary">Bullish</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rates List */}
                <div className="rates-section col-span-full">
                    <div className="section-title-bar">
                        <h3 className="section-title">Exchange Rates</h3>
                        <p className="last-sync">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                    </div>

                    <div className="rates-table glass">
                        <div className="table-header">
                            <span>Currency</span>
                            <span className="text-center">Rate (1 {currency})</span>
                            <span className="text-right">24h Change</span>
                        </div>

                        <div className="table-body">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="shimmer-row"></div>
                                    <div className="shimmer-row"></div>
                                    <div className="shimmer-row"></div>
                                </div>
                            ) : (
                                rates.map((item, idx) => (
                                    <div key={item.code} className="rate-row group" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        <div className="currency-info">
                                            <div className="currency-avatar">
                                                {item.code.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{item.code}</p>
                                                <p className="text-[10px] text-muted font-bold">{item.name}</p>
                                            </div>
                                        </div>
                                        <div className="rate-value font-black text-sm text-center">
                                            {item.rate.toFixed(2)}
                                        </div>
                                        <div className={`change-value text-right flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-secondary' : item.trend === 'down' ? 'text-primary' : 'text-muted'}`}>
                                            {item.trend === 'up' ? <ArrowUpRight size={14} /> : item.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                                            <span className="text-xs font-black">{item.change}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Market;
