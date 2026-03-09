import React, { useState } from 'react';
import { Plus, DollarSign, Tag, FileText } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../hooks/useTheme';

const QuickAdd = () => {
    const { addTransaction, currencySymbol: symbol } = useTransactions();
    const { theme, isLight } = useTheme();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Others',
        type: 'expense'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = JSON.parse(localStorage.getItem('pref_categories') || '["Food & Drinks", "Shopping", "Housing", "Transportation", "Entertainment", "Salary", "Investment", "Others"]');

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount) return;

        setIsSubmitting(true);
        try {
            await addTransaction({
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date()
            });
            setFormData({
                title: '',
                amount: '',
                category: 'Others',
                type: 'expense'
            });
        } catch (error) {
            console.error("Error adding transaction:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBg = isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.03)';
    const inputBorder = `1px solid ${theme.border}`;

    return (
        <div style={{
            background: theme.card,
            padding: '16px 24px',
            borderRadius: 24,
            border: `1px solid ${theme.border}`,
            boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
            marginBottom: 32,
            animation: 'fadeInUp 0.6s ease 0.2s both'
        }}>
            <form onSubmit={handleQuickAdd} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 8 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.orb1 || theme.accent})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <Plus size={18} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: theme.text, whiteSpace: 'nowrap' }}>Quick Add</span>
                </div>

                {/* Title */}
                <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
                    <FileText size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
                    <input
                        type="text"
                        className="quick-add-input"
                        placeholder="Transaction Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={{
                            width: '100%', padding: '10px 12px 10px 36px', borderRadius: 12, border: inputBorder,
                            background: inputBg, color: theme.text, fontSize: '0.85rem', outline: 'none'
                        }}
                    />
                </div>

                {/* Amount */}
                <div style={{ flex: 1, minWidth: 120, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '0.85rem', fontWeight: 600 }}>{symbol}</span>
                    <input
                        type="number"
                        className="quick-add-input"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        style={{
                            width: '100%', padding: '10px 12px 10px 28px', borderRadius: 12, border: inputBorder,
                            background: inputBg, color: theme.text, fontSize: '0.85rem', outline: 'none'
                        }}
                    />
                </div>

                {/* Category */}
                <div style={{ flex: 1, minWidth: 150, position: 'relative' }}>
                    <Tag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
                    <select
                        className="quick-add-input"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{
                            width: '100%', padding: '10px 12px 10px 36px', borderRadius: 12, border: inputBorder,
                            background: inputBg, color: theme.text, fontSize: '0.85rem', outline: 'none', appearance: 'none'
                        }}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Type Toggle */}
                <div style={{ display: 'flex', background: theme.surface, borderRadius: 12, padding: 4, border: inputBorder }}>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                        style={{
                            padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                            background: formData.type === 'income' ? theme.pos : 'transparent',
                            color: formData.type === 'income' ? '#fff' : theme.textMuted,
                            transition: 'all 0.2s'
                        }}
                    >Income</button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                        style={{
                            padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                            background: formData.type === 'expense' ? theme.neg : 'transparent',
                            color: formData.type === 'expense' ? '#fff' : theme.textMuted,
                            transition: 'all 0.2s'
                        }}
                    >Expense</button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="quick-add-btn"
                    disabled={isSubmitting || !formData.title || !formData.amount}
                    style={{
                        padding: '10px 20px', borderRadius: 12, border: 'none',
                        background: theme.accent, color: isLight ? '#fff' : theme.bg,
                        cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem',
                        transition: 'all 0.3s', opacity: (isSubmitting || !formData.title || !formData.amount) ? 0.5 : 1
                    }}
                >
                    {isSubmitting ? '...' : 'Add'}
                </button>
            </form>
            <style>{`
                .quick-add-input:focus { border-color: ${theme.accent} !important; background: ${isLight ? '#fff' : 'rgba(255,255,255,0.05)'} !important; }
                .quick-add-btn:hover { transform: translateY(-1px); opacity: 0.9; }
            `}</style>
        </div>
    );
};

export default QuickAdd;
