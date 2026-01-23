import { z } from "zod"
import { WalletSchema } from "./wallet.schema"
import { StatementSchema } from "./statement.schema"
import { PaginationSchema } from "./pagination.schema"

export const WalletResponseSchema = z.object({
  wallet: WalletSchema,
  statements: z.array(StatementSchema),
  pagination: PaginationSchema,
})

export type WalletResponse = z.infer<typeof WalletResponseSchema>
