import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Supplier, Customer, Invoice, StockAlert, StockMovement } from '../types';

interface ERPContextType {
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  invoices: Invoice[];
  stockAlerts: StockAlert[];
  stockMovements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void;
  updateStock: (productId: string, quantity: number, type: 'in' | 'out', reason: string, reference: string) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    description: 'Pain relief medication',
    sku: 'MED001',
    currentStock: 50,
    minStock: 100,
    maxStock: 1000,
    unitPrice: 2.50,
    supplier: 'PharmaCorp Ltd',
    expiryDate: '2025-12-31',
    batchNumber: 'PC001',
    location: 'Warehouse A-1',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    description: 'Antibiotic medication',
    sku: 'MED002',
    currentStock: 200,
    minStock: 150,
    maxStock: 800,
    unitPrice: 5.75,
    supplier: 'MediSupply Co',
    expiryDate: '2025-08-15',
    batchNumber: 'MS002',
    location: 'Warehouse B-2',
    lastUpdated: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Digital Thermometer',
    category: 'Medical Devices',
    description: 'Digital body thermometer',
    sku: 'DEV001',
    currentStock: 25,
    minStock: 50,
    maxStock: 200,
    unitPrice: 15.99,
    supplier: 'TechMed Solutions',
    location: 'Warehouse C-1',
    lastUpdated: '2024-01-16T09:15:00Z'
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PharmaCorp Ltd',
    contactPerson: 'Michael Johnson',
    email: 'contact@pharmacorp.com',
    phone: '+1-555-0123',
    address: '123 Pharma Street',
    city: 'New York',
    country: 'USA',
    productsSupplied: ['Paracetamol', 'Ibuprofen', 'Aspirin'],
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'MediSupply Co',
    contactPerson: 'Sarah Wilson',
    email: 'info@medisupply.com',
    phone: '+1-555-0456',
    address: '456 Medical Ave',
    city: 'Chicago',
    country: 'USA',
    productsSupplied: ['Antibiotics', 'Vitamins'],
    status: 'active',
    createdAt: '2023-02-10T00:00:00Z'
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'City General Hospital',
    type: 'hospital',
    contactPerson: 'Dr. Emily Brown',
    email: 'procurement@citygeneral.com',
    phone: '+1-555-0789',
    address: '789 Hospital Blvd',
    city: 'Boston',
    country: 'USA',
    creditLimit: 50000,
    currentBalance: 12500,
    status: 'active',
    createdAt: '2023-03-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'MediClinic Network',
    type: 'clinic',
    contactPerson: 'Mark Davis',
    email: 'orders@mediclinic.com',
    phone: '+1-555-0321',
    address: '321 Clinic Road',
    city: 'Los Angeles',
    country: 'USA',
    creditLimit: 25000,
    currentBalance: 3200,
    status: 'active',
    createdAt: '2023-03-15T00:00:00Z'
  }
];

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    // Generate stock alerts for products below minimum stock
    const alerts: StockAlert[] = products
      .filter(p => p.currentStock <= p.minStock)
      .map(p => ({
        id: `alert_${p.id}`,
        productId: p.id,
        productName: p.name,
        currentStock: p.currentStock,
        minStock: p.minStock,
        alertType: p.currentStock === 0 ? 'out_of_stock' : 'low_stock',
        severity: p.currentStock === 0 ? 'high' : p.currentStock <= p.minStock * 0.5 ? 'medium' : 'low',
        createdAt: new Date().toISOString()
      }));
    
    setStockAlerts(alerts);
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
  };

  const updateStock = (productId: string, quantity: number, type: 'in' | 'out', reason: string, reference: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = type === 'in' 
      ? product.currentStock + quantity 
      : Math.max(0, product.currentStock - quantity);

    updateProduct(productId, { currentStock: newStock });

    const movement: StockMovement = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type,
      quantity,
      reason,
      reference,
      userId: 'current_user_id',
      createdAt: new Date().toISOString()
    };

    setStockMovements(prev => [movement, ...prev]);
  };

  return (
    <ERPContext.Provider value={{
      products,
      suppliers,
      customers,
      invoices,
      stockAlerts,
      stockMovements,
      addProduct,
      updateProduct,
      deleteProduct,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addInvoice,
      updateStock
    }}>
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}