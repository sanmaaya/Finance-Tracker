import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    Activity,
    BarChart3,
    Globe,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../hooks/useTheme';
import './Market.css';
import CurrencyConverter from '../components/market/CurrencyConverter';

const MarketCard = ({ theme, isLight, label, value, sub, subColor, icon: Icon, delay }) => {
    const [vis, setVis] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
    return (
        <div style={{
            background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "20px", display: "flex", flexDirection: "column", gap: 8,
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(15px)", transition: "all 0.6s ease",
            boxShadow: isLight ? "0 4px 20px rgba(0,0,0,0.06)" : "none"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", color: theme.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
                <span style={{ fontSize: "0.7rem", color: subColor, fontWeight: 700, background: `${subColor}15`, padding: "2px 8px", borderRadius: 20 }}>{sub}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: "1.45rem", fontWeight: 800, color: theme.text }}>{value}</span>
                {Icon && <Icon size={14} style={{ color: subColor }} />}
            </div>
        </div>
    );
};

const Market = () => {
    const { currency } = useTransactions();
    const { theme, isLight } = useTheme();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
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
        const timer = setTimeout(() => {
            setRates(mockData);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const refreshMarket = () => {
        setLoading(true);
        setTimeout(() => { setLastUpdated(new Date()); setLoading(false); }, 1000);
    };

    return (
        <div style={{ background: theme.bg, minHeight: "100vh", padding: "100px 24px 40px", transition: "all 0.5s ease" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <header style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${theme.pos}15`, color: theme.pos, padding: "4px 12px", borderRadius: 50, width: "fit-content", marginBottom: 12 }}>
                            <Activity size={14} />
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Live Markets</span>
                        </div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 900, color: theme.text }}>Currency <span style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2 || theme.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Insights</span></h1>
                        <p style={{ color: theme.textMuted, fontSize: "0.95rem", marginTop: 6 }}>Global exchange metrics and performance tracker.</p>
                    </div>
                    <button onClick={refreshMarket} disabled={loading} style={{
                        padding: "12px 24px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.card, color: theme.text,
                        display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.3s", fontWeight: 700, fontSize: "0.85rem"
                    }} className="btn-hover-new">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh Live
                    </button>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
                    <MarketCard theme={theme} isLight={isLight} label="DXY Index" value="104.24" sub="+0.04%" subColor={theme.pos} icon={TrendingUp} delay={0} />
                    <MarketCard theme={theme} isLight={isLight} label="EUR/USD" value="1.0824" sub="-0.12%" subColor={theme.neg} icon={ArrowDownRight} delay={100} />
                    <MarketCard theme={theme} isLight={isLight} label="GBP/USD" value="1.2645" sub="+0.22%" subColor={theme.pos} icon={ArrowUpRight} delay={200} />
                    <MarketCard theme={theme} isLight={isLight} label="USD/JPY" value="149.50" sub="+0.85%" subColor={theme.pos} icon={BarChart3} delay={300} />
                </div>

                <div style={{
                    background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "32px", marginBottom: 32, position: "relative", overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${theme.accent}, ${theme.purp})` }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${theme.border}` }}>
                                <Globe size={24} color={theme.accent} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: theme.text }}>Market Overview</h3>
                                <p style={{ fontSize: "0.8rem", color: theme.textMuted }}>Comparison versus {currency}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: theme.pos }}>+2.42%</div>
                            <div style={{ fontSize: "0.7rem", color: theme.textMuted, textTransform: "uppercase", fontWeight: 700 }}>24h Strength</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", height: 120, gap: 4 }}>
                        {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75, 60, 85, 95, 70, 80, 60, 90].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: `linear-gradient(to top, ${theme.accent}05, ${theme.accent}40)`, borderRadius: "4px 4px 0 0", height: `${h}%`, animation: `lux-growth 2s ease-out forwards ${i * 0.05}s`, opacity: 0 }} />
                        ))}
                    </div>
                </div>

                <CurrencyConverter theme={theme} isLight={isLight} initialRates={rates} />

                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 800, color: theme.text }}>Exchange Rates</h3>
                        <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>Sync: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <div style={{ padding: "0 24px" }}>
                        {rates.map((r, i) => (
                            <div key={r.code} style={{
                                display: "flex", alignItems: "center", padding: "18px 0",
                                borderBottom: i < rates.length - 1 ? `1px solid ${theme.border}` : "none"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: theme.accent, border: `1px solid ${theme.border}` }}>{r.code.substring(0, 2)}</div>
                                    <div>
                                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: theme.text }}>{r.code}</div>
                                        <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>{r.name}</div>
                                    </div>
                                </div>
                                <div style={{ flex: 1, textAlign: "center", fontSize: "0.95rem", fontWeight: 800, color: theme.text }}>{r.rate.toFixed(4)}</div>
                                <div style={{ flex: 1, textAlign: "right", color: r.trend === 'up' ? theme.pos : r.trend === 'down' ? theme.neg : theme.textMuted, fontSize: "0.85rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                                    {r.trend === 'up' ? <ChevronUp size={14} /> : r.trend === 'down' ? <ChevronDown size={14} /> : null}
                                    {r.change}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes lux-growth {
                    from { height: 0; opacity: 0; }
                    to { opacity: 1; }
                }
                .btn-hover-new:hover { background: ${theme.accent}15 !important; border-color: ${theme.accent}30 !important; color: ${theme.accent} !important; }
            `}</style>
        </div>
    );
};

export default Market;
