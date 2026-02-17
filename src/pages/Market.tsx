import React, { useState } from 'react';
import { Globe, ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react';
import './Market.css';

interface ExchangeRate {
    code: string;
    name: string;
    rate: number;
    symbol: string;
    flag: string;
}

const Market: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);

    // Default static rates relative to 1 USD (Base)
    const rawRates: Record<string, number> = {
        USD: 1,
        INR: 83.12,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 150.14,
        CAD: 1.35,
        AUD: 1.53,
    };

    const currencies: ExchangeRate[] = [
        { code: 'USD', name: 'US Dollar', rate: 1, symbol: '$', flag: '🇺🇸' },
        { code: 'INR', name: 'Indian Rupee', rate: 83.12, symbol: '₹', flag: '🇮🇳' },
        { code: 'EUR', name: 'Euro', rate: 0.92, symbol: '€', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', rate: 0.79, symbol: '£', flag: '🇬🇧' },
        { code: 'JPY', name: 'Japanese Yen', rate: 150.14, symbol: '¥', flag: '🇯🇵' },
        { code: 'CAD', name: 'Canadian Dollar', rate: 1.35, symbol: 'CA$', flag: '🇨🇦' },
        { code: 'AUD', name: 'Australian Dollar', rate: 1.53, symbol: 'A$', flag: '🇦🇺' },
    ];

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    // Calculate rates relative to the selected base currency
    const baseRateInUSD = rawRates[baseCurrency];

    return (
        <div className="market-page container">
            <div className="market-header glass mb-8">
                <div className="header-info">
                    <div className="title-wrapper gap-3">
                        <div className="icon-box primary">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h1 className="market-title">Global Currency Market</h1>
                            <p className="market-subtitle">Real-time exchange rates against your chosen base currency</p>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className={`refresh-btn glass ${loading ? 'loading' : ''}`}
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={18} />
                        <span>Refresh Rates</span>
                    </button>
                </div>
            </div>

            <div className="market-controls glass mb-8">
                <div className="control-item">
                    <label>Base Currency</label>
                    <div className="base-switcher">
                        {['USD', 'INR', 'EUR', 'GBP'].map(curr => (
                            <button
                                key={curr}
                                className={`base-btn ${baseCurrency === curr ? 'active' : ''}`}
                                onClick={() => setBaseCurrency(curr)}
                            >
                                {curr}
                            </button>
                        ))}
                        <select
                            className="base-select"
                            value={baseCurrency}
                            onChange={(e) => setBaseCurrency(e.target.value)}
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="market-insight">
                    <ArrowRightLeft className="text-primary" size={20} />
                    <span>Showing market value for <strong>1 {baseCurrency}</strong></span>
                </div>
            </div>

            <div className="market-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currencies.map((currency) => {
                    if (currency.code === baseCurrency) return null;

                    // Conversion: (1 / baseRateInUSD) * currencyRateInUSD
                    const convertedRate = (1 / baseRateInUSD) * currency.rate;

                    return (
                        <div key={currency.code} className="rate-card glass animate-fade-in">
                            <div className="card-top">
                                <span className="currency-flag">{currency.flag}</span>
                                <div className="currency-meta">
                                    <h3 className="currency-code">{currency.code}</h3>
                                    <span className="currency-name">{currency.name}</span>
                                </div>
                                <div className="trend-indicator up">
                                    <TrendingUp size={14} />
                                    <span>+0.02%</span>
                                </div>
                            </div>
                            <div className="card-main">
                                <span className="rate-label">1 {baseCurrency} =</span>
                                <div className="rate-display">
                                    <span className="rate-symbol">{currency.symbol}</span>
                                    <h2 className="rate-value">
                                        {convertedRate.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 4
                                        })}
                                    </h2>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="mini-graph">
                                    <div className="graph-line"></div>
                                </div>
                                <span className="update-time">Last updated: Just now</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Market;
