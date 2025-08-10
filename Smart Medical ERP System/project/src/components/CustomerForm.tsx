import React, { useState, useEffect } from 'react';
import { useERP } from '../contexts/ERPContext';
import { Customer } from '../types';

interface CustomerFormProps {
  customer: Customer | null;
  onClose: () => void;
}

export default function CustomerForm({ customer, onClose }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = useERP();
  const [formData, setFormData] = useState({
    name: '',
    type: 'hospital' as 'hospital' | 'clinic' | 'pharmacy' | 'distributor',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    creditLimit: 0,
    currentBalance: 0,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        type: customer.type,
        contactPerson: customer.contactPerson,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        creditLimit: customer.creditLimit,
        currentBalance: customer.currentBalance,
        status: customer.status
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (customer) {
      updateCustomer(customer.id, formData);
    } else {
      addCustomer(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="distributor">Distributor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit *</label>
          <input
            type="number"
            name="creditLimit"
            value={formData.creditLimit}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
          <input
            type="number"
            name="currentBalance"
            value={formData.currentBalance}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {customer ? 'Update' : 'Create'} Customer
        </button>
      </div>
    </form>
  );
}