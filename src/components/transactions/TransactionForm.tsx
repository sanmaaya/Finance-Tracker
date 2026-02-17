import React, { useState, useEffect } from 'react';
import { useTransactions, type Transaction } from '../../context/TransactionContext';
import { Plus, X, DollarSign, Tag, Calendar, FileText } from 'lucide-react';
import './TransactionForm.css';

interface FormProps {
    onClose?: () => void;
    editData?: Transaction;
}

const TransactionForm: React.FC<FormProps> = ({ onClose, editData }) => {
    const { addTransaction, updateTransaction } = useTransactions();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        type: 'expense' as 'income' | 'expense',
        date: new Date().toISOString().split('T')[0]
    });
    const [submitting, setSubmitting] = useState(false);

    const categories: string[] = JSON.parse(localStorage.getItem('pref_categories') || '["Food & Drinks", "Shopping", "Housing", "Transportation", "Entertainment", "Salary", "Investment", "Others"]');

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title,
                amount: String(editData.amount),
                category: editData.category,
                type: editData.type,
                date: editData.date?.toDate
                    ? editData.date.toDate().toISOString().split('T')[0]
                    : new Date(editData.date).toISOString().split('T')[0]
            });
        }
    }, [editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.amount || !formData.category) return;

        setSubmitting(true);
        try {
            if (editData) {
                await updateTransaction(editData.id, {
                    title: formData.title,
                    amount: parseFloat(formData.amount),
                    category: formData.category,
                    type: formData.type,
                    date: new Date(formData.date)
                });
            } else {
                await addTransaction({
                    title: formData.title,
                    amount: parseFloat(formData.amount),
                    category: formData.category,
                    type: formData.type,
                    date: new Date(formData.date)
                });
            }

            // Reset form
            setFormData({
                title: '',
                amount: '',
                category: '',
                type: 'expense',
                date: new Date().toISOString().split('T')[0]
            });

            if (onClose) onClose();
        } catch (error) {
            console.error("Error adding transaction:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container glass">
            <div className="form-header">
                <h3 className="form-title">{editData ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="type-selector flex gap-4 mb-6">
                    <button
                        type="button"
                        className={`type-btn income ${formData.type === 'income' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`type-btn expense ${formData.type === 'expense' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                    >
                        Expense
                    </button>
                </div>

                <div className="input-group">
                    <label className="input-label"><FileText size={16} /> Title</label>
                    <div className="input-wrapper glass">
                        <input
                            type="text"
                            placeholder="e.g. Grocery Shopping"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="input-row flex gap-4">
                    <div className="input-group flex-1">
                        <label className="input-label"><DollarSign size={16} /> Amount</label>
                        <div className="input-wrapper glass">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group flex-1">
                        <label className="input-label"><Calendar size={16} /> Date</label>
                        <div className="input-wrapper glass">
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label"><Tag size={16} /> Category</label>
                    <div className="input-wrapper glass">
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Saving...' : (
                        <>
                            {editData ? <Plus size={18} /> : <Plus size={18} />}
                            <span>{editData ? 'Update Transaction' : 'Add Transaction'}</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
