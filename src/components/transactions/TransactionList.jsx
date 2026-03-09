import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../hooks/useTheme';
import { Trash2, Edit3, Search, Filter, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({ onEdit }) => {
    const { transactions, deleteTransaction, loading, currencySymbol } = useTransactions();
    const { theme } = useTheme();
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
        return <div style={{ color: theme.textMuted, padding: 40, textAlign: "center", fontWeight: 700 }}>Loading transactions...</div>;
    }

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: theme.text }}>Recent Activity</h3>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{
                        background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center",
                        padding: "0 12px", borderRadius: 12, height: 42, width: 240
                    }}>
                        <Search size={16} color={theme.textMuted} />
                        <input
                            type="text"
                            placeholder="Find patterns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: "transparent", border: "none", color: theme.text, outline: "none",
                                fontSize: "0.85rem", marginLeft: 8, width: "100%", fontWeight: 600
                            }}
                        />
                    </div>

                    <div style={{
                        background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center",
                        padding: "0 12px", borderRadius: 12, height: 42
                    }}>
                        <Filter size={16} color={theme.textMuted} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{
                                background: "transparent", border: "none", color: theme.text, outline: "none",
                                fontSize: "0.85rem", cursor: "pointer", fontWeight: 700, marginLeft: 6
                            }}
                        >
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredTransactions.length === 0 ? (
                    <div style={{
                        background: theme.card, border: `1px solid ${theme.border}`, padding: "60px 20px", borderRadius: 24,
                        textAlign: "center", color: theme.textMuted
                    }}>
                        <div style={{ width: 64, height: 64, background: `${theme.accent}10`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <Search size={24} color={theme.accent} />
                        </div>
                        <p style={{ fontWeight: 700 }}>No signals detected.</p>
                        <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    filteredTransactions.map((tx, i) => (
                        <div key={tx.id} style={{
                            background: theme.card, border: `1px solid ${theme.border}`, padding: "16px 20px", borderRadius: 20,
                            display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s",
                            animation: `fadeInUp 0.5s ease-out forwards ${i * 0.05}s`
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14, background: tx.type === 'income' ? `${theme.pos}15` : `${theme.neg}15`,
                                    display: "flex", alignItems: "center", justifyContent: "center", color: tx.type === 'income' ? theme.pos : theme.neg,
                                    border: `1px solid ${tx.type === 'income' ? `${theme.pos}20` : `${theme.neg}20`}`
                                }}>
                                    {tx.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 800, color: theme.text, fontSize: "0.95rem", marginBottom: 4 }}>{tx.title}</h4>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: "0.75rem", color: theme.accent, fontWeight: 700, background: `${theme.accent}10`, padding: "2px 8px", borderRadius: 6 }}>{tx.category}</span>
                                        <span style={{ fontSize: "0.75rem", color: theme.textMuted, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                                            <Calendar size={12} /> {formatDate(tx.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{
                                        fontSize: "1.05rem", fontWeight: 900, color: tx.type === 'income' ? theme.pos : theme.text
                                    }}>
                                        {tx.type === 'income' ? '+' : '-'} {currencySymbol}{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => onEdit(tx)} style={{
                                        width: 34, height: 34, borderRadius: 10, background: `${theme.accent}10`, border: "none", color: theme.accent,
                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                                    }}><Edit3 size={16} /></button>
                                    <button onClick={() => deleteTransaction(tx.id)} style={{
                                        width: 34, height: 34, borderRadius: 10, background: `${theme.neg}10`, border: "none", color: theme.neg,
                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                                    }}><Trash2 size={16} /></button>
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
