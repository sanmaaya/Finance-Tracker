import React, { useState, useEffect } from 'react';
import { RefreshCcw, ArrowRightLeft } from 'lucide-react';

const CurrencyConverter = ({ theme, isLight, initialRates }) => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [result, setResult] = useState(0);

    // Default rates if none passed
    const defaultRates = {
        USD: 1.0,
        INR: 82.95,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        CAD: 1.35,
        AUD: 1.53,
        AED: 3.67
    };

    const rates = initialRates && initialRates.length > 0
        ? initialRates.reduce((acc, r) => ({ ...acc, [r.code]: r.rate }), {})
        : defaultRates;

    useEffect(() => {
        const fromRate = rates[fromCurrency] || 1;
        const toRate = rates[toCurrency] || 1;
        const converted = (amount / fromRate) * toRate;
        setResult(converted);
    }, [amount, fromCurrency, toCurrency, rates]);

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
        <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: "32px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${theme.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${theme.border}` }}>
                    <RefreshCcw size={20} color={theme.accent} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: theme.text }}>Quick Convert</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "flex-end" }} className="converter-grid">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: "0.75rem", color: theme.textMuted, fontWeight: 700, textTransform: "uppercase" }}>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        style={{
                            background: theme.bg,
                            border: `1px solid ${theme.border}`,
                            borderRadius: 12,
                            padding: "12px 16px",
                            color: theme.text,
                            fontSize: "1rem",
                            fontWeight: 600,
                            outline: "none",
                            width: "100%"
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: 8 }} className="currency-selectors">
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: "0.75rem", color: theme.textMuted, fontWeight: 700, textTransform: "uppercase" }}>From</label>
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            style={{
                                background: theme.bg,
                                border: `1px solid ${theme.border}`,
                                borderRadius: 12,
                                padding: "12px 16px",
                                color: theme.text,
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                outline: "none",
                                appearance: "none",
                                cursor: "pointer"
                            }}
                        >
                            {Object.keys(rates).map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={swapCurrencies}
                        style={{
                            background: "transparent",
                            border: `1px solid ${theme.border}`,
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            alignSelf: "flex-end",
                            marginBottom: 4,
                            color: theme.accent,
                            transition: "all 0.3s"
                        }}
                        className="swap-btn"
                    >
                        <ArrowRightLeft size={18} />
                    </button>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: "0.75rem", color: theme.textMuted, fontWeight: 700, textTransform: "uppercase" }}>To</label>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            style={{
                                background: theme.bg,
                                border: `1px solid ${theme.border}`,
                                borderRadius: 12,
                                padding: "12px 16px",
                                color: theme.text,
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                outline: "none",
                                appearance: "none",
                                cursor: "pointer"
                            }}
                        >
                            {Object.keys(rates).map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: "0.75rem", color: theme.textMuted, fontWeight: 700, textTransform: "uppercase" }}>Result</label>
                    <div style={{
                        background: `${theme.accent}10`,
                        border: `1px solid ${theme.accent}30`,
                        borderRadius: 12,
                        padding: "12px 16px",
                        color: theme.accent,
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        minHeight: "48px"
                    }}>
                        {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {toCurrency}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .converter-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .currency-selectors { display: grid !important; grid-template-columns: 1fr auto 1fr !important; }
                }
                .swap-btn:hover { background: ${theme.accent}15 !important; transform: rotate(180deg); }
                select { -webkit-appearance: none; -moz-appearance: none; }
            `}</style>
        </div>
    );
};

export default CurrencyConverter;
