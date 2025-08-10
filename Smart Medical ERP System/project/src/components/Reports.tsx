import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, FileText, Calendar, Download } from 'lucide-react';
import { useERP } from '../contexts/ERPContext';

export default function Reports() {
  const { products, customers, suppliers, invoices, stockMovements } = useERP();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);
  const lowStockItems = products.filter(p => p.currentStock <= p.minStock).length;
  const totalCustomers = customers.length;
  const totalSuppliers = suppliers.length;

  const categoryDistribution = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stockMovementsByMonth = stockMovements.reduce((acc, movement) => {
    const month = new Date(movement.createdAt).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { in: 0, out: 0 };
    }
    acc[month][movement.type] += movement.quantity;
    return acc;
  }, {} as Record<string, { in: number; out: number }>);

  const generateReport = (type: string) => {
    const reportData = {
      inventory: `Inventory Report - Generated on ${new Date().toLocaleDateString()}`,
      sales: `Sales Report - Generated on ${new Date().toLocaleDateString()}`,
      suppliers: `Supplier Report - Generated on ${new Date().toLocaleDateString()}`
    };
    
    const blob = new Blob([reportData[type as keyof typeof reportData] || 'Report'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Business intelligence and performance metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalInventoryValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuppliers}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(([category, count]) => {
              const percentage = (count / products.length) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-500">{count} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Movements */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movements</h3>
          <div className="space-y-4">
            {Object.entries(stockMovementsByMonth).map(([month, data]) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{month}</span>
                <div className="flex space-x-4">
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">In: {data.in}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-600 font-medium">Out: {data.out}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateReport('inventory')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Inventory Report</p>
              <p className="text-sm text-gray-600">Stock levels and valuation</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('sales')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Sales Report</p>
              <p className="text-sm text-gray-600">Revenue and performance</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('suppliers')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Supplier Report</p>
              <p className="text-sm text-gray-600">Supplier performance</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stockMovements.slice(0, 10).map((movement) => (
            <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{movement.productName}</p>
                <p className="text-sm text-gray-600">
                  {movement.type === 'in' ? 'Stock In' : 'Stock Out'} - {movement.reason}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(movement.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}