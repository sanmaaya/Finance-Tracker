import React from 'react';
import {
    Zap,
    Calendar,
    PieChart,
    Clock,
    Plus,
    Smartphone,
    Car,
    Gamepad2,
    Home,
    Trash2,
    Edit2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import './Installments.css';

const Installments: React.FC = () => {
    const {
        installments,
        setIsInstallmentFormOpen,
        currencySymbol: symbol,
        deleteInstallment,
        setEditingInstallment,
        safeBalance
    } = useTransactions();

    const debts = installments.filter(i => i.type === 'debt');

    const totalMonthlyEmi = debts.reduce((sum, item) => sum + item.monthlyEmi, 0);
    const totalRemainingDebt = debts.reduce((sum, item) => sum + (item.totalAmount - (item.monthlyEmi * item.paidMonths)), 0);


    const handleEdit = (item: any) => {
        setEditingInstallment(item);
        setIsInstallmentFormOpen(true);
    };


    const getIcon = (category: string) => {
        switch (category) {
            case 'Electronics': return <Smartphone size={24} />;
            case 'Transport': return <Car size={24} />;
            case 'Life': return <Gamepad2 size={24} />;
            case 'Health': return <Home size={24} />;
            default: return <Zap size={24} />;
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this installment plan?')) {
            await deleteInstallment(id);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="installments-page container pt-12"
        >
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Installments</h1>
                    <p className="text-secondary text-sm">Track your recurring monthly obligations</p>
                </div>
                <div className="flex gap-4">
                    <div className="premium-stat-badge">
                        <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Monthly Total</span>
                        <span className="text-xl font-bold text-primary">{symbol}{totalMonthlyEmi.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={() => {
                            setEditingInstallment(null);
                            setIsInstallmentFormOpen(true);
                        }}
                        className="new-plan-btn flex items-center gap-2"
                    >
                        <Plus size={20} /> New Plan
                    </button>


                </div>
            </header>

            <div className="installments-grid">
                <main>
                    <div className="flex items-center gap-2 mb-8 text-secondary">
                        <Clock size={18} />
                        <span className="text-sm font-semibold uppercase tracking-widest">Active Schedule ({installments.length})</span>
                    </div>

                    <div className="space-y-6">
                        {installments.length === 0 ? (
                            <div className="empty-state text-center py-20 bg-white/5 rounded-[32px] border border-dashed border-white/10">
                                <p className="text-muted">No active installment plans found.</p>
                                <button
                                    onClick={() => setIsInstallmentFormOpen(true)}
                                    className="text-primary font-bold mt-4 hover:underline"
                                >
                                    Create your first plan
                                </button>
                            </div>
                        ) : (
                            installments.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="installment-item group"
                                >
                                    <div className="installment-card-header flex items-center justify-between mb-8">
                                        <div className="installment-info-main flex items-center gap-6">
                                            <div className="icon-box-refined">
                                                {getIcon(item.category)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                                    <div className="flex gap-2">
                                                        <span className={`type-tag-refined ${item.type === 'goal' ? 'savings' : 'debt'}`}>
                                                            {item.type === 'goal' ? 'Savings Goal' : 'Monthly EMI'}
                                                        </span>
                                                        <span className="item-badge-clean">{item.category}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted font-medium flex-wrap">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Start: {item.startDate}</span>
                                                    <span className="flex items-center gap-1.5"><PieChart size={14} /> {item.paidMonths} of {item.tenure} Months</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="installment-financials flex items-center gap-4">
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${item.type === 'goal' ? 'text-emerald-500' : ''}`}>
                                                    {symbol}{item.monthlyEmi.toLocaleString()}
                                                </div>
                                                <div className="text-[10px] text-muted font-bold uppercase tracking-widest">
                                                    {item.type === 'goal' ? 'Monthly Saving' : 'Monthly EMI'}
                                                </div>
                                            </div>

                                            <div className="installment-actions flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-muted hover:text-primary transition-colors"
                                                    title="Edit Plan"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-muted hover:text-rose-500 transition-colors"
                                                    title="Delete Plan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="bar-container-clean">
                                        <div
                                            className="bar-fill-clean"
                                            style={{ width: `${(item.paidMonths / item.tenure) * 100}%` }}
                                        ></div>
                                    </div>

                                    <div className="installment-footer flex justify-between text-xs font-medium text-muted">
                                        <span>Total Paid: <span className="text-text-primary">{symbol}{(item.monthlyEmi * item.paidMonths).toLocaleString()}</span></span>
                                        <span>Remaining: <span className="text-text-primary">{symbol}{(item.totalAmount - (item.monthlyEmi * item.paidMonths)).toLocaleString()}</span></span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>

                <aside>
                    <div className="sidebar-card-clean mb-8">
                        <span className="sidebar-title-muted">Financial Summary</span>

                        <div className="stat-group-clean">
                            <span className="stat-label-clean">Safe Account (Savings)</span>
                            <h2 className="stat-value-clean text-emerald-500">{symbol}{safeBalance.toLocaleString()}</h2>
                        </div>

                        <div className="stat-group-clean">
                            <span className="stat-label-clean">Total Debt Remaining</span>
                            <h2 className="stat-value-clean text-rose-500">{symbol}{totalRemainingDebt.toLocaleString()}</h2>
                        </div>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
};

export default Installments;
