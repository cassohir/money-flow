import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
}
interface TransactionsContextType {
  transactions: Transaction[];
  getTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionsContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getTransactions = useCallback(async (query?: string) => {
    const res = await api.get("/transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });

    setTransactions(res.data);
  }, []);

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data;
      const res = await api.post("/transactions", {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      });

      setTransactions((prev) => [res.data, ...prev]);
    },
    [],
  );

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, getTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
