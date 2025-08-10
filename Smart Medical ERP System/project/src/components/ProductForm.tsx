import React, { useState, useEffect } from 'react';
import { useERP } from '../contexts/ERPContext';
import { Product } from '../types';

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { addProduct, updateProduct, suppliers } = useERP();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    sku: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: '',
    expiryDate: '',
    batchNumber: '',
    location: ''
  });

  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Vitamins',
    'Medical Devices',
    'Cardiovascular',
    'Respiratory',
    'Digestive Health',
    'Dermatology',
    'Emergency Medicine',
    'Other'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        sku: product.sku,
        currentStock: product.currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        unitPrice: product.unitPrice,
        supplier: product.supplier,
        expiryDate: product.expiryDate || '',
        batchNumber: product.batchNumber || '',
        location: product.location
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) {
      updateProduct(product.id, formData);
    } else {
      addProduct(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock *</label>
          <input
            type="number"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleChange}
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock *</label>
          <input
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock *</label>
          <input
            type="number"
            name="maxStock"
            value={formData.maxStock}
            onChange={handleChange}
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Warehouse A-1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
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
          {product ? 'Update' : 'Create'} Product
        </button>
      </div>
    </form>
  );
}