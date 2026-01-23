import { z } from "zod"

export const PaginationSchema = z.object({
  page: z.number().nonnegative(),
  pageSize: z.number().positive(),
  totalElements: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
})

export type Pagination = z.infer<typeof PaginationSchema>