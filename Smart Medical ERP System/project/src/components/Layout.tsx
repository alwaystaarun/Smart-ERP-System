import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useERP } from '../contexts/ERPContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { stockAlerts } = useERP();

  const navigation = [
    { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard },
    { name: 'Inventory', key: 'inventory', icon: Package },
    { name: 'Suppliers', key: 'suppliers', icon: Users },
    { name: 'Customers', key: 'customers', icon: Users },
    { name: 'Invoices', key: 'invoices', icon: FileText },
    { name: 'Reports', key: 'reports', icon: TrendingUp },
    { name: 'Settings', key: 'settings', icon: Settings }
  ];

  const filteredNavigation = user?.role === 'supplier' 
    ? navigation.filter(item => ['dashboard', 'inventory', 'settings'].includes(item.key))
    : navigation;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex h-16 items-center justify-between px-6 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Medical ERP</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onPageChange(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === item.key
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              {stockAlerts.length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{stockAlerts.length}</span>
                  </div>
                </div>
              )}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}