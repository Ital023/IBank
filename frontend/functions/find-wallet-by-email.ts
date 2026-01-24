import { api } from "@/api/axios"
import { Wallet } from "@/schema/wallet.schema";

export async function findWalletByEmail(email: string): Promise<Wallet> {
  const response = await api.get<Wallet>("/wallets", {params: { email }});
  return response.data;
}