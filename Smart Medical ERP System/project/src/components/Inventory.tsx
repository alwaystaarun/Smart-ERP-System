import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import { useERP } from '../contexts/ERPContext';
import { Product } from '../types';
import Modal from './Modal';
import ProductForm from './ProductForm';

export default function Inventory() {
  const { products, deleteProduct, updateStock } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleStockUpdate = (product: Product) => {
    setSelectedProduct(product);
    setShowStockModal(true);
  };

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-100' };
    if (product.currentStock <= product.minStock) return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and stock levels</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.currentStock}</div>
                      <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.status === 'out' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {stockStatus.status === 'low' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {stockStatus.status === 'good' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {stockStatus.status === 'out' ? 'Out of Stock' : 
                         stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStockUpdate(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={editingProduct}
          onClose={() => setShowProductModal(false)}
        />
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Update Stock"
      >
        <StockUpdateForm
          product={selectedProduct}
          onClose={() => setShowStockModal(false)}
          onUpdate={updateStock}
        />
      </Modal>
    </div>
  );
}

function StockUpdateForm({ 
  product, 
  onClose, 
  onUpdate 
}: { 
  product: Product | null;
  onClose: () => void;
  onUpdate: (productId: string, quantity: number, type: 'in' | 'out', reason: string, reference: string) => void;
}) {
  const [type, setType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity && reason) {
      onUpdate(product.id, parseInt(quantity), type, reason, reference);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <p className="text-sm text-gray-900">{product.name}</p>
        <p className="text-xs text-gray-500">Current Stock: {product.currentStock}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'in' | 'out')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Purchase order, Sale, Damaged"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="PO number, invoice number, etc."
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
          Update Stock
        </button>
      </div>
    </form>
  );
}