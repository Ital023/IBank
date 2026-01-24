import { isValidCPF } from "@/hooks/use-cpf";
import z from "zod";

const createWalletSchema = z.object({
    cpf: z
      .string()
      .min(11, "CPF deve conter 11 digitos")
      .transform((value) => value.replace(/\D/g, ""))
      .refine(isValidCPF, { message: "CPF Inválido" }),
    email: z.email(),
    name: z.string(),
  });

  type CreateWalletSchema = z.infer<typeof createWalletSchema>;