"use client";

import { useState } from "react";
import { BalanceCard } from "./components/BalanceCard";
import { Wallet } from "@/schema/wallet.schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findWalletByEmail } from "@/functions/get-wallet";

export default function Home() {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const emailWalletSchema = z.object({
    email: z.email("Email not found"),
  });

  type EmailWalletSchema = z.infer<typeof emailWalletSchema>;

  const {register, handleSubmit, formState: {errors}} = useForm<EmailWalletSchema>({
    resolver: zodResolver(emailWalletSchema),
  });

  function getWallet({email}: EmailWalletSchema) {
    findWalletByEmail(email);
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center mb-8">
          <form onSubmit={handleSubmit(getWallet)} className="flex flex-row gap-3">
            <Input {...register("email")}/>
            <p>{errors.email?.message}</p>
            <Button>Buscar</Button>
          </form>

          <h1 className="text-3xl font-bold text-foreground">🏧 IBank</h1>
          <p className="text-muted-foreground mt-1">
            Banco digital feito por Italo Miranda
          </p>
        </div>
        <BalanceCard wallet={wallet} />
      </div>
    </div>
  );
}
