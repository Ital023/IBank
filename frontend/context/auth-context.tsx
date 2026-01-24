"use client";

import { Wallet } from "@/schema/wallet.schema";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [wallet, setWalletState] = useState<Wallet | null>(() => {
    if (typeof window === "undefined") return null;

    const walletStored = localStorage.getItem("ibank_wallet_user");
    return walletStored ? JSON.parse(walletStored) : null;
  });

  const setWallet = (wallet: Wallet | null) => {
    setWalletState(wallet);
    if (wallet) {
      localStorage.setItem("ibank_wallet_user", JSON.stringify(wallet));
    } else {
      localStorage.removeItem("ibank_wallet_user");
    }
  };

  const logout = () => {
    setWallet(null);
  };

  return (
    <AuthContext.Provider value={{ wallet, setWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
