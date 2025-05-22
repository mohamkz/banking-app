import axiosInstance from "./axios";

export interface Transaction {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  description: string;
  timestamp: string;
}

export const transferService = {
  
  transfer: async (
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
    description: string
  ): Promise<Transaction> => {
    const { data } = await axiosInstance.post<Transaction>('/transfers', {
      senderAccountNumber,
      receiverAccountNumber,
      amount,
      description,
    });
    return data;
  },

   getOutgoingTransfers: async (accountNumber: string): Promise<Transaction[]> => {
    const { data } = await axiosInstance.get<Transaction[]>(`/transfers/sent/account/${accountNumber}`);
    return data;
  },

  getIncomingTransfers: async (accountNumber: string): Promise<Transaction[]> => {
    const { data } = await axiosInstance.get<Transaction[]>(`/transfers/received/account/${accountNumber}`);
    return data;
  },

  getAllTransfersForAccount: async (accountNumber: string): Promise<Transaction[]> => {
    const { data } = await axiosInstance.get<Transaction[]>(`/transfers/account/${accountNumber}`);
    return data;
  },

  formatTransactionDate: (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) 
        ? 'Date invalide' 
        : date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return 'Date invalide';
    }
  }
};