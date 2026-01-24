import { api } from "@/api/axios"
import { Wallet } from "@/schema/wallet.schema";

export async function findWalletByEmail(email: string) {
  const response = await api.get<Wallet>("/wallets", {params: { email }});
  console.log(response.data);  
}