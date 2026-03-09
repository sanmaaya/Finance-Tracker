import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Market from './pages/Market';
import Analytics from './pages/Analytics';
import Installments from './pages/Installments';
import Landing from './pages/Landing';
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useTheme } from './hooks/useTheme';
import TransactionForm from './components/transactions/TransactionForm';
import InstallmentForm from './components/installments/InstallmentForm';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const {
    isFormOpen,
    setIsFormOpen,
    isInstallmentFormOpen,
    setIsInstallmentFormOpen,
    editingTransaction,
    setEditingTransaction
  } = useTransactions();

  if (loading) return null;

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleCloseInstallmentForm = () => {
    setIsInstallmentFormOpen(false);
  };
  return (
    <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/installments" element={user ? <Installments /> : <Navigate to="/" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
          <Route path="/market" element={user ? <Market /> : <Navigate to="/" />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {user && <Footer />}

      {(isFormOpen || isInstallmentFormOpen) && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: `${theme.bg}B0`,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            width: '100%', maxWidth: 500, margin: 20, animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {isFormOpen && (
              <TransactionForm
                onClose={handleCloseForm}
                editData={editingTransaction || undefined}
              />
            )}
            {isInstallmentFormOpen && (
              <InstallmentForm
                onClose={handleCloseInstallmentForm}
              />
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};


const App = () => {
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
