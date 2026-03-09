import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const TransactionContext = createContext(undefined);

export const TransactionProvider = ({ children }) => {
    // Initialize from localStorage for instant offline access
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('paisa_transactions');
        return saved ? JSON.parse(saved) : [];
    });
    const [installments, setInstallments] = useState(() => {
        const saved = localStorage.getItem('paisa_installments');
        return saved ? JSON.parse(saved) : [];
    });

    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isInstallmentFormOpen, setIsInstallmentFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editingInstallment, setEditingInstallment] = useState(null);
    const [currency, setCurrency] = useState(localStorage.getItem('pref_currency') || 'USD');
    const { user, loading: authLoading } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);
    const [needsSync, setNeedsSync] = useState(false);

    // User-specific localStorage keys to prevent data clashing
    const getStorageKey = useCallback((type) => {
        return user ? `paisa_${type}_${user.uid}` : `paisa_${type}_local`;
    }, [user]);

    // Persist to localStorage whenever state changes, but ONLY after initial fetch
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(getStorageKey('transactions'), JSON.stringify(transactions));
        }
    }, [transactions, isInitialized, user, getStorageKey]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(getStorageKey('installments'), JSON.stringify(installments));
        }
    }, [installments, isInitialized, user, getStorageKey]);

    const currencySymbol = useMemo(() => {
        switch (currency) {
            case 'INR': return '₹';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'JPY': return '¥';
            default: return '$';
        }
    }, [currency]);

    const updateCurrency = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('pref_currency', newCurrency);
    };

    useEffect(() => {
        // Wait for auth to resolve before making decisions
        if (authLoading) return;

        if (!user) {
            // User is definitely not logged in
            // Try to load local-only data if it exists
            const localSaved = localStorage.getItem('paisa_transactions_local');
            if (localSaved) setTransactions(JSON.parse(localSaved));
            else setTransactions([]);

            const localInstSaved = localStorage.getItem('paisa_installments_local');
            if (localInstSaved) setInstallments(JSON.parse(localInstSaved));
            else setInstallments([]);

            setLoading(false);
            setIsInitialized(true);
            return;
        }

        // Check for migration from old agnostic keys to user-specific or local keys
        const oldTransRaw = localStorage.getItem('paisa_transactions');
        const oldInstRaw = localStorage.getItem('paisa_installments');

        if (oldTransRaw || oldInstRaw) {
            console.log("🛠️ [Migration] Detected legacy data. Preparing for safe Cloud Sync...");

            try {
                // Parse the legacy data
                const oldTransactions = oldTransRaw ? JSON.parse(oldTransRaw) : [];
                const oldInstallments = oldInstRaw ? JSON.parse(oldInstRaw) : [];

                // Move to user-specific keys immediately as a backup
                if (oldTransRaw) localStorage.setItem(`paisa_transactions_${user.uid}`, oldTransRaw);
                if (oldInstRaw) localStorage.setItem(`paisa_installments_${user.uid}`, oldInstRaw);

                // If Firestore is currently empty (we'll check this in the snapshots), 
                // we should offer to upload this local data.
                // For now, let's keep it in state so the user sees it immediately.
                if (oldTransactions.length > 0 || oldInstallments.length > 0) {
                    setTransactions(oldTransactions);
                    setInstallments(oldInstallments);
                    setNeedsSync(true); // Flag that local data needs cloud push
                }

                // Clear legacy keys to prevent re-migration
                localStorage.removeItem('paisa_transactions');
                localStorage.removeItem('paisa_installments');
            } catch (e) {
                console.error("Migration failed:", e);
            }
        }

        setLoading(true);

        // Transactions listener with better error handling
        const qTransactions = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid)
        );

        const unsubscribeTransactions = onSnapshot(qTransactions,
            (snapshot) => {
                const transData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort in memory to bypass Firebase Index requirement temporarily
                const sortedData = transData.sort((a, b) => {
                    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
                    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
                    return (dateB.getTime() || 0) - (dateA.getTime() || 0);
                });

                console.log(`📡 [Sync] Fetched ${transData.length} transactions for user ${user.uid}`);

                // CRITICAL: If Firestore is empty but we have local data from migration, 
                // we SHOULD NOT overwrite with empty list immediately.
                // Instead, we favor Firestore but log the discrepancy.
                if (transData.length === 0 && transactions.length > 0 && !isInitialized) {
                    console.log("💡 [Sync] Cloud is empty but local has data. Use 'Push to Cloud' in Settings to backup your local data.");
                    // We keep the local data for now so it doesn't "vanish"
                } else {
                    setTransactions(sortedData);
                }

                if (!isInitialized) setIsInitialized(true);
            },
            (error) => {
                console.error("Firestore Error (Transactions):", error);
                if (error.code === 'permission-denied') {
                    alert("⚠️ Firebase Access Denied: Your security rules are blocking data. Please check the 'Security Rules' instructions I sent.");
                } else if (error.code === 'failed-precondition') {
                    console.error("Missing Index. Click the link in the console to create it.");
                    alert("⚠️ Database Index Missing: The app needs a special index to show data. I've logged the creation link in the browser console (Press F12).");
                } else if (error.message && error.message.includes('blocked-by-client')) {
                    alert("🚫 AdBlocker Detected: Please disable your AdBlocker for this site, as it is blocking the connection to your database.");
                }
                setLoading(false);
            }
        );

        // Installments listener
        const qInstallments = query(
            collection(db, 'installments'),
            where('userId', '==', user.uid)
            // Removed orderBy to bypass index requirement
        );

        const unsubscribeInstallments = onSnapshot(qInstallments,
            (snapshot) => {
                const instData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(`📡 [Sync] Fetched ${instData.length} installments for user ${user.uid}`);

                if (instData.length === 0 && installments.length > 0 && !isInitialized) {
                    setNeedsSync(true);
                } else {
                    setInstallments(instData);
                }

                setLoading(false);
                if (!isInitialized) setIsInitialized(true);
            },
            (error) => {
                console.error("Firestore Error (Installments):", error);
                if (error.code === 'permission-denied') {
                    // One alert is enough, but logging is good
                    console.error("Permission denied for installments");
                }
                setLoading(false);
            }
        );

        return () => {
            unsubscribeTransactions();
            unsubscribeInstallments();
        };
    }, [user, authLoading, isInitialized, transactions.length, installments.length]);

    const addTransaction = async (transaction) => {
        if (!user) return;
        await addDoc(collection(db, 'transactions'), {
            ...transaction,
            amount: Number(transaction.amount),
            userId: user.uid,
            createdAt: Timestamp.now()
        });
    };

    const deleteTransaction = async (id) => {
        await deleteDoc(doc(db, 'transactions', id));
    };

    const updateTransaction = async (id, updates) => {
        const sanitized = { ...updates };
        if (sanitized.amount !== undefined) sanitized.amount = Number(sanitized.amount);
        await updateDoc(doc(db, 'transactions', id), sanitized);
    };

    const addInstallment = async (installment) => {
        if (!user) return;
        await addDoc(collection(db, 'installments'), {
            ...installment,
            totalAmount: Number(installment.totalAmount),
            monthlyEmi: Number(installment.monthlyEmi),
            userId: user.uid,
            createdAt: Timestamp.now()
        });
    };

    const deleteInstallment = async (id) => {
        await deleteDoc(doc(db, 'installments', id));
    };

    const updateInstallment = async (id, updates) => {
        const sanitized = { ...updates };
        if (sanitized.totalAmount !== undefined) sanitized.totalAmount = Number(sanitized.totalAmount);
        if (sanitized.monthlyEmi !== undefined) sanitized.monthlyEmi = Number(sanitized.monthlyEmi);
        await updateDoc(doc(db, 'installments', id), sanitized);
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

    const importAllData = async (data) => {
        if (!user) {
            alert("Please login to import data.");
            return;
        }

        setLoading(true);
        try {
            const promises = [];

            if (data.transactions && Array.isArray(data.transactions)) {
                data.transactions.forEach(t => {
                    const { id, createdAt, userId, ...tx } = t;
                    // Improved date parsing for different formats
                    if (tx.date && typeof tx.date === 'object' && tx.date.seconds) {
                        tx.date = new Timestamp(tx.date.seconds, tx.date.nanoseconds);
                    } else if (tx.date) {
                        tx.date = new Date(tx.date);
                    } else {
                        tx.date = new Date();
                    }
                    tx.amount = Number(tx.amount) || 0;
                    promises.push(addTransaction(tx));
                });
            }

            if (data.installments && Array.isArray(data.installments)) {
                data.installments.forEach(i => {
                    const { id, createdAt, userId, ...inst } = i;
                    inst.totalAmount = Number(inst.totalAmount) || 0;
                    inst.monthlyEmi = Number(inst.monthlyEmi) || 0;
                    promises.push(addInstallment(inst));
                });
            }

            if (promises.length === 0) {
                throw new Error("No valid data found to import.");
            }

            await Promise.all(promises);
        } catch (error) {
            console.error("Import operation failed:", error);
            if (error.code === 'permission-denied') {
                alert("Firebase Permission Denied: Please check your Firestore Security Rules.");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const syncLocalToCloud = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await importAllData({ transactions, installments });
            setNeedsSync(false);
            alert("☁️ Cloud Sync Complete! Your data is now safely stored in the Vault.");
        } catch (e) {
            console.error(e);
            alert("Failed to sync to cloud. Check your connection.");
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
                await addTransaction(t);
            }
            for (const i of demoInstallments) {
                await addInstallment(i);
            }

            alert('Paisa has been reloaded with premium demo data! 🚀');
        } catch (error) {
            console.error(error);
            if (error.code === 'permission-denied') {
                alert('Firebase Forbidden: Your Firestore rules are blocking the demo data seeding. Please check your security rules.');
            } else {
                alert('Failed to reload data. Check connection.');
            }
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
            importAllData,
            syncLocalToCloud,
            needsSync
        }}>
            {children}
        </TransactionContext.Provider>
    );
};


