import z from "zod";

export const StatementOperationEnum = z.enum([
  "DEBIT",
  "CREDIT",
])

export const StatementSchema = z.object({
  statementId: z.string(),
  type: z.string(),
  literal: z.string(),
  value: z.number(),
  datetime: z
    .string()
    .transform(val => new Date(val)),
  operation: StatementOperationEnum
})

export type Statement = z.infer<typeof StatementSchema>
