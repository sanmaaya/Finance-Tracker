import React, { createContext, useContext, useState, useEffect } from 'react';
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
    date: any; // Firestore Timestamp when retrieved, Date when created
    createdAt: any;
    userId: string;
}

interface TransactionContextType {
    transactions: Transaction[];
    loading: boolean;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    isFormOpen: boolean;
    setIsFormOpen: (open: boolean) => void;
    editingTransaction: Transaction | null;
    setEditingTransaction: (transaction: Transaction | null) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        // Listen to real-time updates from Firestore
        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const transData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[];

            setTransactions(transData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => {
        if (!user) return;
        await addDoc(collection(db, 'transactions'), {
            ...transaction,
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

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    return (
        <TransactionContext.Provider value={{
            transactions,
            loading,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            totalBalance,
            totalIncome,
            totalExpense,
            isFormOpen,
            setIsFormOpen,
            editingTransaction,
            setEditingTransaction
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
