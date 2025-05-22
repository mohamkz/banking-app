import axiosInstance from './axios';

export interface UserRes {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRes {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
  openingDate: string;
  userId: number;
}

export interface Transaction {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  description: string;
  type: string;
  timestamp: string;
}

export interface SystemStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalTransactionsAmount: number;
}

export interface MonthlyStats {
  month: string;
  transactionCount: number;
  totalAmount: number;
}

export interface DailyStats {
    date: string;
    transactionCount: number;
    totalAmount: number;
}

const adminService = {
  getAllUsers: async (): Promise<UserRes[]> => {
    try {
      const { data } = await axiosInstance.get('/admin/users');
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  getAllAccounts: async (): Promise<AccountRes[]> => {
    try {
      const { data } = await axiosInstance.get('/admin/accounts');
      return data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data } = await axiosInstance.get('/admin/transactions');
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  getSystemStats: async (): Promise<SystemStats> => {
    try {
      const { data } = await axiosInstance.get('/admin/system-stats');
      return data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw new Error('Failed to fetch system statistics');
    }
  },

  get12MonthStats: async (): Promise<MonthlyStats[]> => {
    try {
      const { data } = await axiosInstance.get('/admin/12-month-stats');
      return data;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw new Error('Failed to fetch monthly statistics');
    }
  },

  getDailyStats: async (): Promise<DailyStats[]> => {
    try {
      const { data } = await axiosInstance.get('/admin/daily-stats');
      return data;
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      throw new Error('Failed to fetch daily statistics');
    }
  }

};

export default adminService;