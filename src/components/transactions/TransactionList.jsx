import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { Trash2, Edit3, Search, Filter, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({ onEdit }) => {
    const { transactions, deleteTransaction, loading, currency, currencySymbol } = useTransactions();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;

        return matchesSearch && matchesType;
    });

    const formatDate = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return <div className="loading-state">Loading transactions...</div>;
    }

    return (
        <div className="transaction-section">
            <div className="section-header flex justify-between items-center mb-6">
                <h3 className="section-title">Recent Transactions</h3>

                <div className="filters-container flex gap-4">
                    <div className="search-box glass">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search title, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-box glass">
                        <Filter size={18} className="filter-icon" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income Only</option>
                            <option value="expense">Expense Only</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="transaction-list">
                {filteredTransactions.length === 0 ? (
                    <div className="empty-state glass">
                        <p>No transactions found.</p>
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-item glass">
                            <div className="item-main">
                                <div className={`item-type-icon ${transaction.type}`}>
                                    {transaction.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                </div>
                                <div className="item-details">
                                    <h4 className="item-title">{transaction.title}</h4>
                                    <div className="item-meta">
                                        <span className="item-category">{transaction.category}</span>
                                        <span className="dot">•</span>
                                        <span className="item-date flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(transaction.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="item-right">
                                <span className={`item-amount ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {currencySymbol}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <div className="item-actions">
                                    <button
                                        className="action-btn edit"
                                        title="Edit"
                                        onClick={() => onEdit(transaction)}
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        title="Delete"
                                        onClick={() => deleteTransaction(transaction.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionList;
