import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  TableHTMLAttributes,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import {
  User,
  authService,
  storeAuthData,
  clearAuthData,
  getCurrentUser,
} from "@/api/auth";
import { accountService } from "@/api/accounts";
import { Transaction, transferService } from "@/api/transactions";
import adminService,  { SystemStats, MonthlyStats, UserRes, AccountRes, DailyStats  } from "@/api/admins";

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
  openingDate: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  accounts: Account[];
  selectedAccount: Account | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchAccounts: () => Promise<Account[]>;
  selectAccount: (account: Account) => void;
  createAccount: () => Promise<Account>;
  deposit: (
    accountNumber: string,
    amount: number,
    description: string
  ) => Promise<Account>;
  transfer: (
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
    description: string
  ) => Promise<Transaction>;
  updateProfile: (profileData: Partial<User>) => Promise<User>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  fetchUserProfile: () => Promise<User>;
  getOutgoingTransfers: (accountNumber: string) => Promise<Transaction[]>;
  getIncomingTransfers: (accountNumber: string) => Promise<Transaction[]>;
  getAllTransfersForAccount: (accountNumber: string) => Promise<Transaction[]>;
  adminGetAllUsers: () => Promise<UserRes[]>;
  adminGetAllAccounts: () => Promise<AccountRes[]>;
  adminGetAllTransactions: () => Promise<Transaction[]>;
  adminGetSystemStats: () => Promise<SystemStats>;
  adminGet12MonthStats: () => Promise<MonthlyStats[]>;
  adminGetDailyStats: () => Promise<DailyStats[]>;

  };

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const navigate = useNavigate();

  const handleError = (error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const message = (error as Error)?.message || defaultMessage;
    toast.error(message);
    return false;
  };
  
 const adminGetAllUsers = useCallback(async (): Promise<UserRes[]> => {
    try {
      const users = await adminService.getAllUsers();
      return users;
    } catch (error) {
      handleError(error, "Failed to fetch users");
      return [];
    }
  }, []);

  const adminGetAllAccounts = useCallback(async (): Promise<AccountRes[]> => {
    try {
      const accounts = await adminService.getAllAccounts();
      return accounts;
    } catch (error) {
      handleError(error, "Failed to fetch accounts");
      return [];
    }
  }, []);

  const adminGetAllTransactions = useCallback(
    async (): Promise<Transaction[]> => {
      try {
        const transactions = await adminService.getAllTransactions();
        return transactions;
      } catch (error) {
        handleError(error, "Failed to fetch transactions");
        return [];
      }
    },
    []
  );
  
  const adminGetSystemStats = useCallback(
    async (): Promise<SystemStats> => {
      try {
        const stats = await adminService.getSystemStats();
        return stats;
      } catch (error) {
        handleError(error, "Failed to fetch system stats");
        return {
          totalUsers: 0,
          totalAccounts: 0,
          totalTransactions: 0,
          totalTransactionsAmount: 0
        };
      }
    },
    []
  );
  
  const adminGet12MonthStats = useCallback(
    async (): Promise<MonthlyStats[]> => {
      try {
        const stats = await adminService.get12MonthStats();
        return stats;
      } catch (error) {
        handleError(error, "Failed to fetch monthly stats");
        return [];
      }
    },
    []
  );
  
  const adminGetDailyStats = useCallback(
    async (): Promise<DailyStats[]> => {
      try {
        const stats = await adminService.getDailyStats();
        return stats;
      } catch (error) {
        handleError(error, "Failed to fetch daily stats");
        return [];
      }
    },
    []
  );
  

  const getOutgoingTransfers = useCallback(
    async (accountNumber: string): Promise<Transaction[]> => {
      try {
        return await transferService.getOutgoingTransfers(accountNumber);
      } catch (error) {
        toast.error(error.message);
        return [];
      }
    },
    []
  );

  const getIncomingTransfers = useCallback(
    async (accountNumber: string): Promise<Transaction[]> => {
      try {
        return await transferService.getIncomingTransfers(accountNumber);
      } catch (error) {
        toast.error(error.message);
        return [];
      }
    },
    []
  );

  const getAllTransfersForAccount = useCallback(
    async (accountNumber: string): Promise<Transaction[]> => {
      try {
        return await transferService.getAllTransfersForAccount(accountNumber);
      } catch (error) {
        toast.error(error.message);
        return [];
      }
    },
    []
  );

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const profileData = getCurrentUser();
      if (profileData) {
        setUser(profileData);
        localStorage.setItem("user", JSON.stringify(profileData));
      } else {
        clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to verify session:", error);
    }
  }, []);


  const fetchAccounts = useCallback(async (): Promise<Account[]> => {
    try {
      setIsLoading(true);
      // Use your API service to fetch accounts
      const userAccounts = await accountService.getOwnedAccounts();
      setAccounts(userAccounts);

      // Restore selected account from localStorage if available
      const storedSelectedAccountNumber = localStorage.getItem(
        "selectedAccountNumber"
      );
      if (storedSelectedAccountNumber) {
        const storedAccount = userAccounts.find(
          (acc) => acc.accountNumber === storedSelectedAccountNumber
        );
        if (storedAccount) {
          setSelectedAccount(storedAccount);
        }
      }
      return userAccounts;
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      toast.error("Failed to load your accounts");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const storedUser = getCurrentUser();
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(storedUser);
        await refreshUser();

        // If user is authenticated but not admin, fetch their accounts
        if (storedUser && !storedUser.roles.includes("ROLE_ADMIN")) {
          await fetchAccounts();
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [refreshUser, fetchAccounts]);

  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
    localStorage.setItem("selectedAccountNumber", account.accountNumber);
    navigate(`/user/dashboard/${account.accountNumber}`);
  };

  const createAccount = async (): Promise<Account> => {
    setIsLoading(true);
    try {
      const newAccount = await accountService.createNewAccount();
      setAccounts((prev) => [...prev, newAccount]);
      toast.success("Compte créé avec succès");
      return newAccount;
    } catch (error) {
      toast.error("Erreur lors de la création du compte");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      storeAuthData(response);
      setUser(response.user);
      toast.success("Connexion réussie");

      if (response.user.roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
        return true;
      }

      const userAccounts = await fetchAccounts();
      setAccounts(userAccounts);

      if (userAccounts.length === 0) {
        navigate("/user/create-account");
      } else {
        navigate("/user/account-selection");
      }

      return true;
    } catch (error) {
      toast.error("Email ou mot de passe incorrect");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success("Inscription réussie !");
      navigate("/login?registration=success");
      return true;
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      handleError(error, "Logout error");
    } finally {
      clearAuthData();
      setUser(null);
      setAccounts([]);
      setSelectedAccount(null);
      localStorage.removeItem("selectedAccountNumber");
      setIsLoading(false);
      navigate("/login");
    }
  };

  const fetchUserProfile = useCallback(async (): Promise<User> => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(
    async (profileData: Partial<User>): Promise<User> => {
      try {
        const updatedUser = await authService.updateProfile(profileData);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("Updated user:", updatedUser);
        toast.dismiss();
        toast.success("Profil mis à jour avec succès");

        return updatedUser;
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du profil");
        throw error;
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<void> => {
      try {
        await authService.changePassword(currentPassword, newPassword);
        toast.success("Mot de passe changé avec succès");
      } catch (error) {
        toast.error("Erreur lors du changement de mot de passe");
        throw error;
      }
    },
    []
  );

  const deposit = async (
    accountNumber: string,
    amount: number,
    description: string
  ): Promise<Account> => {
    setIsLoading(true);
    try {
      const updatedAccount = await accountService.deposit(
        accountNumber,
        amount,
        description
      );

      setAccounts((prev) => {
        if (!Array.isArray(prev)) return [updatedAccount];

        return prev.map((acc) =>
          acc.accountNumber.toString() === accountNumber.toString()
            ? updatedAccount
            : acc
        );
      });

      setSelectedAccount((prev) =>
        prev?.accountNumber === accountNumber ? updatedAccount : prev
      );

      toast.success(`Dépôt de ${amount} ${updatedAccount.currency} effectué`);
      window.location.href = `/user/dashboard/${accountNumber}`;
      return updatedAccount;
    } catch (error) {
      toast.error(error.message || "Erreur lors du dépôt");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Transaction function

  const transfer = async (
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
    description: string
  ): Promise<Transaction> => {
    setIsLoading(true);
    try {
      if (amount <= 0) throw new Error("Le montant doit être positif");
      if (senderAccountNumber === receiverAccountNumber) {
        throw new Error("Vous ne pouvez pas transférer vers le même compte");
      }

      const transaction = await transferService.transfer(
        senderAccountNumber,
        receiverAccountNumber,
        amount,
        description
      );

      setAccounts((prevAccounts) =>
        prevAccounts.map((account) => {
          if (account.accountNumber === senderAccountNumber) {
            return { ...account, balance: account.balance - amount };
          }
          if (account.accountNumber === receiverAccountNumber) {
            return { ...account, balance: account.balance + amount };
          }
          return account;
        })
      );

      toast.success(
        `Transfert réussi de ${amount} vers le compte ${receiverAccountNumber}`
      );
      return transaction;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors du transfert";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }

    

    

  };

  const contextValue: AuthContextType = {
    user,
    isAdmin: Boolean(user?.roles?.includes("ROLE_ADMIN")),
    isAuthenticated: Boolean(user),
    isLoading,
    accounts,
    selectedAccount,
    login,
    register,
    logout,
    refreshUser,
    fetchAccounts,
    selectAccount,
    createAccount,
    deposit,
    transfer,
    updateProfile,
    changePassword,
    fetchUserProfile,
    getOutgoingTransfers,
    getIncomingTransfers,
    getAllTransfersForAccount,
    adminGetAllUsers,
    adminGetAllAccounts,
    adminGetAllTransactions,
    adminGetSystemStats,
    adminGet12MonthStats,
    adminGetDailyStats,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
