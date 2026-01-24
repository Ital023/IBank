import { api } from "@/api/axios"
import { WalletResponse } from "@/schema/wallet-response.schema";
import { Wallet } from "@/schema/wallet.schema";

export async function findWalletByEmail(email: string): Promise<Wallet> {
  const response = await api.get<Wallet>("/wallets", {params: { email }});
  return response.data;
}

export async function getWalletWithStatements(walletId: string): Promise<WalletResponse> {
  const response = await api.get<WalletResponse>(`/wallets/${walletId}/statements`);
  return response.data;
}