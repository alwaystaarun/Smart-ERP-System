import React, { useState } from 'react';
import { Building, Plus, Edit, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
import { useERP } from '../contexts/ERPContext';
import { Supplier } from '../types';
import Modal from './Modal';
import SupplierForm from './SupplierForm';

export default function Suppliers() {
  const { suppliers, deleteSupplier } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleDelete = (supplierId: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(supplierId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600 mt-1">Manage your supplier relationships and contacts</p>
        </div>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setShowSupplierModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {supplier.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {supplier.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {supplier.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {supplier.city}, {supplier.country}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Contact Person</p>
              <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Products Supplied</p>
              <div className="flex flex-wrap gap-1">
                {supplier.productsSupplied.slice(0, 3).map((product, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {product}
                  </span>
                ))}
                {supplier.productsSupplied.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    +{supplier.productsSupplied.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Supplier Modal */}
      <Modal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => setShowSupplierModal(false)}
        />
      </Modal>
    </div>
  );
}