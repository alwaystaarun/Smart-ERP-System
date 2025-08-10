import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { useERP } from '../contexts/ERPContext';
import { Customer } from '../types';
import Modal from './Modal';
import CustomerForm from './CustomerForm';

export default function Customers() {
  const { customers, deleteCustomer } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const customerTypes = ['hospital', 'clinic', 'pharmacy', 'distributor'];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || customer.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(customerId);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      hospital: 'bg-blue-100 text-blue-800',
      clinic: 'bg-green-100 text-green-800',
      pharmacy: 'bg-purple-100 text-purple-800',
      distributor: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and accounts</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setShowCustomerModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          {customerTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(customer.type)}`}>
                    {customer.type}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {customer.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {customer.city}, {customer.country}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Contact Person</p>
              <p className="text-sm text-gray-600">{customer.contactPerson}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Credit Limit:</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${customer.creditLimit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Current Balance:</span>
                <span className={`text-sm font-medium ${
                  customer.currentBalance > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${customer.currentBalance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {customer.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Customer Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onClose={() => setShowCustomerModal(false)}
        />
      </Modal>
    </div>
  );
}