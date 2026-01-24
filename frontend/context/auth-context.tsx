"use client";

import { Wallet } from "@/schema/wallet.schema";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (wallet) {
      localStorage.setItem("wallet", JSON.stringify(wallet));
    }
  }, [wallet]);

  return (
    <AuthContext.Provider value={{ wallet, setWallet }}>
      {children}
    </AuthContext.Provider>
  );
}
