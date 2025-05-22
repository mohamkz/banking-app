import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsList from "@/components/dashboard/TransactionsList";
import TransferModal from "@/components/transactions/TransferModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Transactions = () => {
  const { selectedAccount, getAllTransfersForAccount, getIncomingTransfers, getOutgoingTransfers } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "incoming" | "outgoing">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!selectedAccount) return;
      
      setIsLoading(true);
      try {
        const data = await (activeTab === "incoming" 
          ? getIncomingTransfers(selectedAccount.accountNumber)
          : activeTab === "outgoing" 
          ? getOutgoingTransfers(selectedAccount.accountNumber)
          : getAllTransfersForAccount(selectedAccount.accountNumber));
        
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [selectedAccount, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => setShowModal(true)}>Nouveau virement</Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="incoming">Entrantes</TabsTrigger>
          <TabsTrigger value="outgoing">Sortantes</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[52px] w-full" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <TransactionsList 
                transactions={transactions} 
                accountNumber={selectedAccount?.accountNumber}
              />
            </TabsContent>
            
            <TabsContent value="incoming">
              <TransactionsList
                transactions={transactions.filter(t => 
                  t.receiverAccountNumber === selectedAccount?.accountNumber
                )}
                accountNumber={selectedAccount?.accountNumber}
              />
            </TabsContent>

            <TabsContent value="outgoing">
              <TransactionsList
                transactions={transactions.filter(t => 
                  t.senderAccountNumber === selectedAccount?.accountNumber
                )}
                accountNumber={selectedAccount?.accountNumber}
              />
            </TabsContent>
          </>
        )}
      </Tabs>

      <TransferModal 
        open={showModal} 
        onOpenChange={setShowModal}
        onSuccess={() => {
          setActiveTab("all");
          loadTransactions();
        }}
      />
    </div>
  );
};

export default Transactions;