import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ERPProvider } from './contexts/ERPContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Suppliers from './components/Suppliers';
import Customers from './components/Customers';
import Invoices from './components/Invoices';
import Reports from './components/Reports';
import Settings from './components/Settings';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'suppliers':
        return <Suppliers />;
      case 'customers':
        return <Customers />;
      case 'invoices':
        return <Invoices />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ERPProvider>
        <AppContent />
      </ERPProvider>
    </AuthProvider>
  );
}

export default App;