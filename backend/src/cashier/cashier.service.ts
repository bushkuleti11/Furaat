import { Injectable } from '@nestjs/common';

// In-memory data storage
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  id: number;
  items: any[];
  total: number;
  paid: number;
  balance: number;
  timestamp: string;
}

@Injectable()
export class CashierService {
  // In-memory product list
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, quantity: 5 },
    { id: 2, name: 'Mouse', price: 25, quantity: 20 },
    { id: 3, name: 'Keyboard', price: 75, quantity: 15 },
    { id: 4, name: 'Monitor', price: 300, quantity: 8 },
    { id: 5, name: 'USB Cable', price: 10, quantity: 50 },
  ];

  // In-memory sales history
  private transactions: Transaction[] = [];
  private transactionId = 1;

  // Get all products
  getProducts(): Product[] {
    return this.products;
  }

  // Add new product (Admin only)
  addProduct(name: string, price: number, quantity: number): Product {
    const newProduct: Product = {
      id: Math.max(...this.products.map(p => p.id), 0) + 1,
      name,
      price,
      quantity,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // Process checkout
  checkout(items: Array<{ productId: number; quantity: number }>, paid: number) {
    let total = 0;

    // Calculate total and deduct from inventory
    items.forEach(item => {
      const product = this.products.find(p => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
        product.quantity -= item.quantity; // Reduce inventory
      }
    });

    const balance = paid - total;

    // Record transaction
    const transaction: Transaction = {
      id: this.transactionId++,
      items,
      total,
      paid,
      balance,
      timestamp: new Date().toISOString(),
    };

    this.transactions.push(transaction);

    return {
      success: true,
      total,
      paid,
      balance,
      message: balance >= 0 ? 'Payment successful!' : 'Insufficient payment!',
    };
  }

  // Get sales summary
  getSalesSummary() {
    const totalRevenue = this.transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = this.transactions.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalTransactions,
      averageTransaction: parseFloat(averageTransaction.toFixed(2)),
      transactions: this.transactions,
    };
  }
}
