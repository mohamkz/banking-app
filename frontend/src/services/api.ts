import axios from 'axios';

// Creating a mock API service for now
const BASE_URL = 'https://api.fraudwatch.example/v1';

// This is a simulated API for frontend development
// In a real application, this would connect to your backend
const api = {
  // Auth methods
  auth: {
    login: async (email: string, password: string) => {
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, we're hardcoding some users
      if (email === 'admin@example.com' && password === 'password') {
        return { 
          success: true, 
          user: { 
            id: '1', 
            name: 'Admin User', 
            email: 'admin@example.com', 
            role: 'ROLE_ADMIN',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&h=250&auto=format&fit=crop'
          },
          token: 'admin-token-123'
        };
      } else if (email === 'user@example.com' && password === 'password') {
        return { 
          success: true, 
          user: { 
            id: '2', 
            name: 'John Client', 
            email: 'user@example.com', 
            role: 'ROLE_USER',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop'
          },
          token: 'user-token-456'
        };
      }
      
      // Failed login
      return { 
        success: false, 
        message: 'Invalid credentials' 
      };
    },
    
    register: async (name: string, email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would create a user in the database
      return { 
        success: true, 
        user: { 
          id: '3', 
          name, 
          email, 
          role: 'ROLE_USER' 
        },
        token: 'new-user-token-789'
      };
    },
    
    logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },
  
  // Banking APIs
  banking: {
    // Get account balance
    getBalance: async (userId: string) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data
      return {
        balance: 12450.75,
        currency: 'EUR',
        accountNumber: 'FR76 3000 6000 0123 4567 8901 234',
        lastUpdated: new Date().toISOString()
      };
    },
    
    // Get transactions
    getTransactions: async (userId: string, limit = 20) => {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Generate mock transactions
      const transactions = [];
      const types = ['deposit', 'withdrawal', 'transfer'];
      const merchants = ['Amazon', 'Carrefour', 'Netflix', 'Uber', 'SNCF', 'Apple'];
      
      for (let i = 0; i < limit; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const isDeposit = type === 'deposit';
        const amount = parseFloat((Math.random() * 500 + 10).toFixed(2));
        
        transactions.push({
          id: `t-${i+1}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          type,
          amount: isDeposit ? amount : -amount,
          balance: 12450.75 + (isDeposit ? amount : -amount),
          description: type === 'transfer' 
            ? `Transfer to Jean Dupont`
            : `${isDeposit ? 'Deposit from' : 'Payment to'} ${merchants[Math.floor(Math.random() * merchants.length)]}`,
          riskScore: Math.random() > 0.85 ? (Math.random() * 0.8 + 0.2).toFixed(2) : null
        });
      }
      
      return transactions;
    },
    
    // Make a transaction
    createTransaction: async (data: {
      amount: number;
      recipient: string;
      description: string;
      userId: string;
    }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random risk score (higher is riskier)
      const riskScore = Math.random(); 
      const isFlagged = riskScore > 0.7;
      
      return {
        success: true,
        transaction: {
          id: `t-new-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'transfer',
          amount: -data.amount,
          recipient: data.recipient,
          description: data.description,
          riskScore: riskScore.toFixed(2),
          isFlagged
        }
      };
    }
  },
  
  // Admin APIs
  admin: {
    // Get app stats
    getStats: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        userCount: 14523,
        accountsCount: 18654,
        activeAlerts: 32,
        activeUsers: 8745,
        transactionCount: 198543,
        fraudsCaught: 128,
        totalTransactionValue: 16452345
      };
    },
    
    // Get fraud alerts
    getAlerts: async (limit = 20) => {
      await new Promise(resolve => setTimeout(resolve, 900));
      
      const alerts = [];
      const merchants = ['Amazon', 'Alibaba', 'PayPal', 'Binance', 'Unknown Merchant', 'Foreign Payment'];
      const users = [
        { id: 'u1', name: 'Marie Dubois' },
        { id: 'u2', name: 'Thomas Martin' },
        { id: 'u3', name: 'Julie Bernard' },
        { id: 'u4', name: 'Nicolas Petit' },
        { id: 'u5', name: 'Sophie Richard' }
      ];
      
      for (let i = 0; i < limit; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const severity = Math.random();
        
        alerts.push({
          id: `a-${i+1}`,
          date: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
          userId: user.id,
          userName: user.name,
          transactionId: `t-${100 + i}`,
          amount: parseFloat((Math.random() * 1500 + 100).toFixed(2)),
          merchant: merchants[Math.floor(Math.random() * merchants.length)],
          riskScore: (Math.random() * 0.3 + 0.7).toFixed(2),
          reason: severity > 0.7 
            ? 'Unusual location and amount'
            : (severity > 0.5 ? 'Unusual transaction pattern' : 'High-risk merchant'),
          status: Math.random() > 0.7 ? 'pending' : (Math.random() > 0.5 ? 'confirmed' : 'rejected'),
          alertLevel: severity > 0.7 ? 'high' : (severity > 0.5 ? 'medium' : 'low')
        });
      }
      
      return alerts;
    },
    
    // Get all users (for admin)
    getUsers: async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return [
        { 
          id: 'u1', 
          name: 'Marie Dubois', 
          email: 'marie.dubois@example.com',
          role: 'ROLE_USER',
          status: 'active',
          accountsCount: 2,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          riskProfile: 'low'
        },
        { 
          id: 'u2', 
          name: 'Thomas Martin', 
          email: 'thomas.martin@example.com',
          role: 'ROLE_USER',
          status: 'active',
          accountsCount: 1,
          lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          riskProfile: 'medium'
        },
        { 
          id: 'u3', 
          name: 'Julie Bernard', 
          email: 'julie.bernard@example.com',
          role: 'ROLE_USER',
          status: 'suspended',
          accountsCount: 3,
          lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          riskProfile: 'high'
        },
        { 
          id: 'u4', 
          name: 'Nicolas Petit', 
          email: 'nicolas.petit@example.com',
          role: 'ROLE_ADMIN',
          status: 'active',
          accountsCount: 1,
          lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          riskProfile: 'low'
        },
        { 
          id: 'u5', 
          name: 'Sophie Richard', 
          email: 'sophie.richard@example.com',
          role: 'ROLE_USER',
          status: 'active',
          accountsCount: 2,
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          riskProfile: 'low'
        }
      ];
    },
    
    // Process alert
    processAlert: async (alertId: string, action: 'confirm' | 'reject') => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        alert: {
          id: alertId,
          status: action === 'confirm' ? 'confirmed' : 'rejected',
          processedAt: new Date().toISOString()
        }
      };
    },
    
    // Update user status
    updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'deleted') => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        success: true,
        user: {
          id: userId,
          status,
          updatedAt: new Date().toISOString()
        }
      };
    }
  }
};

export default api;
