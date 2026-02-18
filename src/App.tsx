import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Market from './pages/Market';
import Installments from './pages/Installments';
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTransactions } from './context/TransactionContext';
import TransactionForm from './components/transactions/TransactionForm';
import InstallmentForm from './components/installments/InstallmentForm';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const {
    isFormOpen,
    setIsFormOpen,
    isInstallmentFormOpen,
    setIsInstallmentFormOpen,
    editingTransaction,
    setEditingTransaction
  } = useTransactions();

  if (loading) return <div className="loading-screen">Loading Paisa!...</div>;

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleCloseInstallmentForm = () => {
    setIsInstallmentFormOpen(false);
  };


  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/installments" element={user ? <Installments /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/market" element={user ? <Market /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TransactionForm
              onClose={handleCloseForm}
              editData={editingTransaction || undefined}
            />
          </div>
        </div>
      )}

      {isInstallmentFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InstallmentForm
              onClose={handleCloseInstallmentForm}
            />
          </div>
        </div>
      )}

    </div>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TransactionProvider>
            <AppContent />
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
