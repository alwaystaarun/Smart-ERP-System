export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'supplier';
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  expiryDate?: string;
  batchNumber?: string;
  location: string;
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  productsSupplied: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'distributor';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  creditLimit: number;
  currentBalance: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
  createdBy: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  alertType: 'low_stock' | 'out_of_stock' | 'expiring_soon';
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  reference: string;
  userId: string;
  createdAt: string;
}