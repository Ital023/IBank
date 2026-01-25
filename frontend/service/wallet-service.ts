import { api } from "@/api/axios";
import { WalletResponse } from "@/schema/wallet-response.schema";
import { Wallet } from "@/schema/wallet.schema";
import axios from "axios";

export async function findWalletByEmail(email: string): Promise<Wallet> {
  const response = await api.get<Wallet>("/wallets", { params: { email } });
  return response.data;
}

export async function getWalletWithStatements(
  walletId: string,
): Promise<WalletResponse> {
  const response = await api.get<WalletResponse>(
    `/wallets/${walletId}/statements`,
  );
  return response.data;
}

export async function createWallet(
  cpf: string,
  email: string,
  name: string,
): Promise<boolean> {
  try {
    const response = await api.post("/wallets", { cpf, email, name });

    return response.status === 201;
  } catch (error) {
    console.log("Erro ao criar carteira", error);
    return false;
  }
}

export async function depositWallet(depositValue: number, walletId: string,): Promise<boolean> {
  try {
    const response = await api.post(`/wallets/${walletId}/deposits`, { depositValue });

    return response.status === 200;
  } catch (error) {
    console.log("Erro ao depositar dinheiro", error);
    return false;
  }
}
