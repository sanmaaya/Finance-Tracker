import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, PieChart, Info } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import './InstallmentForm.css';

const InstallmentForm = ({ onClose }) => {
    const { addInstallment, updateInstallment, currencySymbol, editingInstallment, setEditingInstallment } = useTransactions();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        totalAmount: '',
        monthlyEmi: '',
        tenure: '',
        paidMonths: '0',
        startDate: new Date().toISOString().split('T')[0],
        category: 'Electronics',
        type: 'debt'
    });

    useEffect(() => {
        if (editingInstallment) {
            setFormData({
                name: editingInstallment.name,
                totalAmount: editingInstallment.totalAmount.toString(),
                monthlyEmi: editingInstallment.monthlyEmi.toString(),
                tenure: editingInstallment.tenure.toString(),
                paidMonths: editingInstallment.paidMonths.toString(),
                startDate: editingInstallment.startDate,
                category: editingInstallment.category,
                type: editingInstallment.type || 'debt'
            });
        }
    }, [editingInstallment]);


    const categories = ['Electronics', 'Transport', 'Life', 'Health', 'Subscription', 'Education', 'Others'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const installmentData = {
                name: formData.name,
                totalAmount: Number(formData.totalAmount),
                monthlyEmi: Number(formData.monthlyEmi),
                tenure: Number(formData.tenure),
                paidMonths: Number(formData.paidMonths),
                startDate: formData.startDate,
                category: formData.category,
                type: formData.type
            };


            if (editingInstallment) {
                await updateInstallment(editingInstallment.id, installmentData);
            } else {
                await addInstallment(installmentData);
            }

            handleClose();
        } catch (error) {
            console.error("Error processing installment:", error);
            alert("Failed to save installment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEditingInstallment(null);
        onClose();
    };

    return (
        <div className="installment-form-container">
            <div className="form-header">
                <div className="header-info">
                    <h2 className="text-2xl font-black tracking-tight">
                        {editingInstallment ? 'Edit Plan' : 'New Installment'}
                    </h2>
                    <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">
                        {editingInstallment ? 'Update your installment details' : 'Plan your long-term growth'}
                    </p>
                </div>
                <button onClick={handleClose} className="close-btn">
                    <X size={20} />
                </button>
            </div>

            <div className="type-selector premium-type-selector mb-8">
                <button
                    type="button"
                    className={`type-btn ${formData.type === 'debt' ? 'active debt' : ''}`}
                    onClick={() => setFormData({ ...formData, type: 'debt' })}
                >
                    EMI / Debt
                </button>
                <button
                    type="button"
                    className={`type-btn ${formData.type === 'goal' ? 'active goal' : ''}`}
                    onClick={() => setFormData({ ...formData, type: 'goal' })}
                >
                    Savings Goal
                </button>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">

                <div className="form-grid">
                    <div className="input-field full">
                        <label>Plan Name</label>
                        <div className="input-wrapper">
                            <Tag size={18} className="input-icon" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. iPhone 15 Pro Max"
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Total Amount ({currencySymbol})</label>
                        <div className="input-wrapper">
                            <DollarSign size={18} className="input-icon" />
                            <input
                                type="number"
                                required
                                value={formData.totalAmount}
                                onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Monthly EMI ({currencySymbol})</label>
                        <div className="input-wrapper">
                            <PieChart size={18} className="input-icon" />
                            <input
                                type="number"
                                required
                                value={formData.monthlyEmi}
                                onChange={e => setFormData({ ...formData, monthlyEmi: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Tenure (Months)</label>
                        <div className="input-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <input
                                type="number"
                                required
                                value={formData.tenure}
                                onChange={e => setFormData({ ...formData, tenure: e.target.value })}
                                placeholder="e.g. 12"
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Months Already Paid</label>
                        <div className="input-wrapper">
                            <Info size={18} className="input-icon" />
                            <input
                                type="number"
                                value={formData.paidMonths}
                                onChange={e => setFormData({ ...formData, paidMonths: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Category</label>
                        <div className="input-wrapper">
                            <Tag size={18} className="input-icon" />
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Start Date</label>
                        <div className="input-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" onClick={handleClose} className="cancel-btn">Cancel</button>
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Saving...' : (editingInstallment ? 'Save Changes' : 'Create Plan')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InstallmentForm;
