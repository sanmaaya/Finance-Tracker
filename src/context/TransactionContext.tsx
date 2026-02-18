import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    date: any;
    createdAt: any;
    userId: string;
}

export interface Installment {
    id: string;
    name: string;
    totalAmount: number;
    monthlyEmi: number;
    tenure: number;
    paidMonths: number;
    startDate: any;
    category: string;
    type: 'debt' | 'goal';
    userId: string;
    createdAt: any;
}


interface TransactionContextType {
    transactions: Transaction[];
    installments: Installment[];
    loading: boolean;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    addInstallment: (installment: Omit<Installment, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
    deleteInstallment: (id: string) => Promise<void>;
    updateInstallment: (id: string, updates: Partial<Installment>) => Promise<void>;
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    isFormOpen: boolean;
    setIsFormOpen: (open: boolean) => void;
    isInstallmentFormOpen: boolean;
    setIsInstallmentFormOpen: (open: boolean) => void;
    editingTransaction: Transaction | null;
    setEditingTransaction: (transaction: Transaction | null) => void;
    editingInstallment: Installment | null;
    setEditingInstallment: (installment: Installment | null) => void;
    currency: string;
    currencySymbol: string;
    updateCurrency: (currency: string) => void;
    safeBalance: number;
    seedDefaultData: () => Promise<void>;
    resetAllData: () => Promise<void>;
    importAllData: (data: { transactions: any[], installments: any[] }) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage for instant offline access
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('paisa_transactions');
        return saved ? JSON.parse(saved) : [];
    });
    const [installments, setInstallments] = useState<Installment[]>(() => {
        const saved = localStorage.getItem('paisa_installments');
        return saved ? JSON.parse(saved) : [];
    });

    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isInstallmentFormOpen, setIsInstallmentFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
    const [currency, setCurrency] = useState(localStorage.getItem('pref_currency') || 'USD');
    const { user, loading: authLoading } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);

    // Persist to localStorage whenever state changes, but ONLY after initial fetch
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('paisa_transactions', JSON.stringify(transactions));
        }
    }, [transactions, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('paisa_installments', JSON.stringify(installments));
        }
    }, [installments, isInitialized]);

    const currencySymbol = useMemo(() => {
        switch (currency) {
            case 'INR': return '₹';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'JPY': return '¥';
            default: return '$';
        }
    }, [currency]);

    const updateCurrency = (newCurrency: string) => {
        setCurrency(newCurrency);
        localStorage.setItem('pref_currency', newCurrency);
    };

    useEffect(() => {
        // Wait for auth to resolve before making decisions
        if (authLoading) return;

        if (!user) {
            // User is definitely not logged in
            setTransactions([]);
            setInstallments([]);
            localStorage.removeItem('paisa_transactions');
            localStorage.removeItem('paisa_installments');
            setLoading(false);
            setIsInitialized(true);
            return;
        }

        setLoading(true);

        // Transactions listener with better error handling
        const qTransactions = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribeTransactions = onSnapshot(qTransactions,
            (snapshot) => {
                const transData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Transaction[];
                setTransactions(transData);
                if (!isInitialized) setIsInitialized(true);
            },
            (error: any) => {
                console.error("Firestore Error (Transactions):", error);
                if (error.code === 'failed-precondition') {
                    console.error("The query requires an index. Check the Firebase Console.");
                }
                setLoading(false);
            }
        );

        // Installments listener
        const qInstallments = query(
            collection(db, 'installments'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribeInstallments = onSnapshot(qInstallments,
            (snapshot) => {
                const instData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Installment[];
                setInstallments(instData);
                setLoading(false);
                if (!isInitialized) setIsInitialized(true);
            },
            (error: any) => {
                console.error("Firestore Error (Installments):", error);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeTransactions();
            unsubscribeInstallments();
        };
    }, [user, authLoading]);

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => {
        if (!user) return;
        await addDoc(collection(db, 'transactions'), {
            ...transaction,
            amount: Number(transaction.amount),
            userId: user.uid,
            createdAt: Timestamp.now()
        });
    };

    const deleteTransaction = async (id: string) => {
        await deleteDoc(doc(db, 'transactions', id));
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        await updateDoc(doc(db, 'transactions', id), updates);
    };

    const addInstallment = async (installment: Omit<Installment, 'id' | 'createdAt' | 'userId'>) => {
        if (!user) return;
        await addDoc(collection(db, 'installments'), {
            ...installment,
            totalAmount: Number(installment.totalAmount),
            monthlyEmi: Number(installment.monthlyEmi),
            userId: user.uid,
            createdAt: Timestamp.now()
        });
    };

    const deleteInstallment = async (id: string) => {
        await deleteDoc(doc(db, 'installments', id));
    };

    const updateInstallment = async (id: string, updates: Partial<Installment>) => {
        await updateDoc(doc(db, 'installments', id), updates);
    };

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const baseExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyDebtEmi = installments
        .filter(i => i.type === 'debt')
        .reduce((sum, i) => sum + i.monthlyEmi, 0);

    const totalExpense = baseExpense + monthlyDebtEmi;
    const totalBalance = totalIncome - totalExpense;

    const safeBalance = installments
        .filter(i => i.type === 'goal')
        .reduce((sum, i) => sum + (i.monthlyEmi * i.paidMonths), 0);

    const resetAllData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const deletePromises = [
                ...transactions.map(t => deleteTransaction(t.id)),
                ...installments.map(i => deleteInstallment(i.id))
            ];
            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Error clearing data:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const importAllData = async (data: { transactions: any[], installments: any[] }) => {
        if (!user) return;
        setLoading(true);
        try {
            const promises = [
                ...(data.transactions || []).map(t => {
                    const { id, createdAt, userId, ...tx } = t;
                    // Ensure date is a valid date object or Timestamp
                    if (tx.date && tx.date.seconds) {
                        tx.date = new Timestamp(tx.date.seconds, tx.date.nanoseconds);
                    } else {
                        tx.date = new Date(tx.date);
                    }
                    tx.amount = Number(tx.amount);
                    return addTransaction(tx);
                }),
                ...(data.installments || []).map(i => {
                    const { id, createdAt, userId, ...inst } = i;
                    inst.totalAmount = Number(inst.totalAmount);
                    inst.monthlyEmi = Number(inst.monthlyEmi);
                    return addInstallment(inst);
                })
            ];
            await Promise.all(promises);
        } catch (error) {
            console.error("Error importing data:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const seedDefaultData = async () => {
        if (!user) return;
        if (!window.confirm('This will delete all current data and replace it with demo data. Continue?')) return;

        setLoading(true);

        try {
            // 1. Clear existing data efficiently
            await resetAllData();

            // 2. Add New Demo Data
            const now = new Date();
            const demoTransactions = [
                // Current Month
                { title: 'Monthly Salary', amount: 95000, category: 'Salary', type: 'income', date: new Date(now.getFullYear(), now.getMonth(), 1) },
                { title: 'Luxury Apartment Rent', amount: 32000, category: 'Housing', type: 'expense', date: new Date(now.getFullYear(), now.getMonth(), 2) },
                { title: 'Gourmet Dining', amount: 4500, category: 'Food & Drinks', type: 'expense', date: new Date(now.getFullYear(), now.getMonth(), 14) },

                // Last Month
                { title: 'Job Bonus', amount: 25000, category: 'Salary', type: 'income', date: new Date(now.getFullYear(), now.getMonth() - 1, 5) },
                { title: 'Shopping Spree', amount: 15000, category: 'Shopping', type: 'expense', date: new Date(now.getFullYear(), now.getMonth() - 1, 10) },
                { title: 'Restaurant bill', amount: 4500, category: 'Food & Drinks', type: 'expense', date: new Date(now.getFullYear(), now.getMonth() - 1, 15) },

                // 2 Months Ago
                { title: 'Monthly Salary', amount: 95000, category: 'Salary', type: 'income', date: new Date(now.getFullYear(), now.getMonth() - 2, 1) },
                { title: 'Rent payment', amount: 32000, category: 'Housing', type: 'expense', date: new Date(now.getFullYear(), now.getMonth() - 2, 2) },
                { title: 'Tech Upgrade', amount: 45000, category: 'Shopping', type: 'expense', date: new Date(now.getFullYear(), now.getMonth() - 2, 15) },
            ];

            const demoInstallments = [
                { name: 'MacBook Pro M3 Max', totalAmount: 350000, monthlyEmi: 29000, tenure: 12, paidMonths: 4, category: 'Electronics', type: 'debt', startDate: '2023-10-01' },
                { name: 'Retirement Fund', totalAmount: 10000000, monthlyEmi: 50000, tenure: 120, paidMonths: 12, category: 'Life', type: 'goal', startDate: '2023-01-01' },
                { name: 'Tesla Model S Goal', totalAmount: 8500000, monthlyEmi: 150000, tenure: 48, paidMonths: 6, category: 'Transport', type: 'goal', startDate: '2023-07-20' }
            ];

            for (const t of demoTransactions) {
                await addTransaction(t as any);
            }
            for (const i of demoInstallments) {
                await addInstallment(i as any);
            }

            alert('Paisa has been reloaded with premium demo data! 🚀');
        } catch (error) {
            console.error(error);
            alert('Failed to reload data. Check connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TransactionContext.Provider value={{
            transactions,
            installments,
            loading,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            addInstallment,
            deleteInstallment,
            updateInstallment,
            totalBalance,
            totalIncome,
            totalExpense,
            isFormOpen,
            setIsFormOpen,
            isInstallmentFormOpen,
            setIsInstallmentFormOpen,
            editingTransaction,
            setEditingTransaction,
            editingInstallment,
            setEditingInstallment,
            currency,
            currencySymbol,
            updateCurrency,
            safeBalance,
            seedDefaultData,
            resetAllData,
            importAllData
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
