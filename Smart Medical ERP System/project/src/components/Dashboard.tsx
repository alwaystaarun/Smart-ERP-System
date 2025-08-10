import React from 'react';
import { 
  Package, 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { useERP } from '../contexts/ERPContext';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { products, suppliers, customers, invoices, stockAlerts } = useERP();
  const { user } = useAuth();

  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      change: '+4.75%',
      changeType: 'positive'
    },
    {
      name: 'Inventory Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+2.3%',
      changeType: 'positive'
    },
    {
      name: 'Low Stock Alerts',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: stockAlerts.length > 0 ? `${stockAlerts.length} active` : 'None',
      changeType: stockAlerts.length > 0 ? 'negative' : 'positive'
    },
    {
      name: user?.role === 'supplier' ? 'Products Supplied' : 'Active Suppliers',
      value: user?.role === 'supplier' ? products.length : activeSuppliers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+1.2%',
      changeType: 'positive'
    }
  ];

  const recentAlerts = stockAlerts.slice(0, 5);
  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Stock Alerts</h2>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          {recentAlerts.length > 0 ? (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{alert.productName}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {alert.currentStock} / Min: {alert.minStock}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {alert.alertType.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No stock alerts at the moment</p>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category} • SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${product.unitPrice}</p>
                  <p className={`text-sm ${
                    product.currentStock <= product.minStock ? 'text-red-600' : 'text-green-600'
                  }`}>
                    Stock: {product.currentStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-8 w-8 text-blue-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Product</p>
              <p className="text-sm text-gray-600">Add new inventory item</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-8 w-8 text-green-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Invoice</p>
              <p className="text-sm text-gray-600">Generate new invoice</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-8 w-8 text-purple-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Stock Update</p>
              <p className="text-sm text-gray-600">Update inventory levels</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}