import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

import './Cards.css';

interface SummaryProps {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
}

const Cards: React.FC<SummaryProps> = ({ totalBalance, totalIncome, totalExpense }) => {
    const { currencySymbol } = useTransactions();

    const formatCurrency = (amount: number) => {
        return `${currencySymbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };


    return (
        <div className="summary-cards-grid">
            <div className="summary-card balance glass">
                <div className="card-header">
                    <div className="card-icon balance-icon">
                        <Wallet size={20} />
                    </div>
                    <span className="card-label">Total Balance</span>
                </div>
                <div className="card-body">
                    <h2 className="card-amount">{formatCurrency(totalBalance)}</h2>
                    <div className={`card-badge balance-badge`}>
                        {totalBalance >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{totalBalance >= 0 ? 'Liquid' : 'Overdrawn'}</span>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${Math.min(Math.max((totalBalance / (totalIncome || 1)) * 100, 10), 100)}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="summary-card income glass">
                <div className="card-header">
                    <div className="card-icon income-icon">
                        <TrendingUp size={20} />
                    </div>
                    <span className="card-label">Monthly Income</span>
                </div>
                <div className="card-body">
                    <h2 className="card-amount text-income">{formatCurrency(totalIncome)}</h2>
                    <div className="card-badge income-badge">
                        <ArrowUpRight size={14} />
                        <span>+12.5%</span>
                    </div>
                </div>
                <div className="card-footer">
                    <span className="footer-text">Vs last month</span>
                </div>
            </div>

            <div className="summary-card expense glass">
                <div className="card-header">
                    <div className="card-icon expense-icon">
                        <TrendingDown size={20} />
                    </div>
                    <span className="card-label">Monthly Expenses</span>
                </div>
                <div className="card-body">
                    <h2 className="card-amount text-expense">{formatCurrency(totalExpense)}</h2>
                    <div className="card-badge expense-badge">
                        <ArrowDownRight size={14} />
                        <span>-5.2%</span>
                    </div>
                </div>
                <div className="card-footer">
                    <span className="footer-text">Vs last month</span>
                </div>
            </div>
        </div>
    );
};

export default Cards;
