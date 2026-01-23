import z from "zod";

export const WalletSchema = z.object({
  walletId: z.string(),
  cpf: z.string().length(11),
  name: z.string(),
  email: z.email(),
  balance: z.number()
})

export type Wallet = z.infer<typeof WalletSchema>