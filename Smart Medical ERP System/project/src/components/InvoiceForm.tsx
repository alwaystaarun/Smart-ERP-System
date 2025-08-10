import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useERP } from '../contexts/ERPContext';
import { InvoiceItem } from '../types';

interface InvoiceFormProps {
  onClose: () => void;
}

export default function InvoiceForm({ onClose }: InvoiceFormProps) {
  const { customers, products, addInvoice } = useERP();
  const [customerId, setCustomerId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10); // 10% default tax

  const selectedCustomer = customers.find(c => c.id === customerId);

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    const item = updatedItems[index];
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.unitPrice = product.unitPrice;
      }
    } else if (field === 'quantity' || field === 'unitPrice') {
      item[field] = Number(value);
    }
    
    item.total = item.quantity * item.unitPrice;
    setItems(updatedItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || items.length === 0 || items.some(item => !item.productId)) {
      return;
    }

    const invoice = {
      customerId,
      customerName: selectedCustomer?.name || '',
      items: items.filter(item => item.productId),
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      status: 'draft' as const,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'current_user_id'
    };

    addInvoice(invoice);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Invoice Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${product.unitPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                  ${item.total.toFixed(2)}
                </div>
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Totals */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
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
          Create Invoice
        </button>
      </div>
    </form>
  );
}