import axiosInstance from './axios';


export interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    currency: string;
    openingDate: string;
    userId: string;
}

export const accountService = {

  getOwnedAccounts: async (): Promise<Account[]> => {
    const { data } = await axiosInstance.get<Account[]>('/accounts/owned');
    return data;
  },

  createNewAccount: async (): Promise<Account> => {
    const { data } = await axiosInstance.post<Account>('/accounts/new', {});
    return data;
  },

  getAccountByNumber: async (accountNumber: string): Promise<Account> => {
    const { data } = await axiosInstance.get<Account>(`/accounts/${accountNumber}`);
    return data;
  },

  deposit: async (accountNumber: string, amount: number, description: string): Promise<Account> => {
    
    if (amount <= 0) throw new Error("Le montant doit être positif");
    if (amount > 10000) throw new Error("Dépôt trop important");
    
    const { data } = await axiosInstance.post<Account>(`/accounts/${accountNumber}/deposit`, { amount, description});
    return data;
  },
};


