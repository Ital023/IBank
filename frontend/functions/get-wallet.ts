import { api } from "@/api/axios"
import axios from "axios"

// interface GetWalletType {
//   email: string
// }

export async function findWalletByEmail(email: string) {
  const response = await api.get("/wallets", {params: { email }});
  console.log(response);
  
}