"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
  DollarSign,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { useWallet } from "@/hooks/use-wallet";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputBlock } from "@/components/shared/input-block";
import { StateButton } from "@/components/shared/state-button";
import axios from "axios";
import { toast } from "sonner";
import { depositWallet } from "@/service/wallet-service";

const quickAmounts = [50, 100, 200, 500, 1000];

export default function DepositPage() {
  const { formatCurrency } = useCurrency();
  const { wallet, setWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const depositSchema = z.object({
    depositValue: z.number(),
  });

  type DepositSchema = z.infer<typeof depositSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
  });

  const depositValue = watch("depositValue");

  async function handleDeposit({ depositValue }: DepositSchema) {
    try {
      setIsLoading(true);

      if (!wallet?.walletId) {
        toast.warning("Carteira não encontrada");
        return;
      }
      const response = await depositWallet(depositValue, wallet.walletId);

      if (!response) {
        toast.warning("Deposito não foi realizado!");
      }

      wallet.balance += depositValue;
      setWallet(wallet);

      setIsSuccess(true);
      toast.success("Deposito realizado com sucesso!");

      setTimeout(()=>{
        setIsSuccess(false);
        router.push("/");
      },(1500))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.warning(error.response?.data?.title ?? "Carteira não encontrada");
      } else {
        toast.warning("Erro inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-primary" />
            ) : (
              <ArrowDownToLine className="w-8 h-8 text-primary" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {isSuccess ? "Depósito realizado com sucesso!" : "Depósito"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? `${formatCurrency(depositValue)} foi adicionado para sua carteira!`
                : "Adicione dinheiro a sua carteira imediatamente"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit(handleDeposit)} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-12  w-5 h-5 text-muted-foreground" />
                  <InputBlock
                    type="number"
                    placeholder="0.00"
                    className="h-14 pl-10 text-2xl font-semibold bg-input/50 border-border/50"
                    step="0.01"
                    min="0"
                    register={register}
                    name="depositValue"
                    label="Quantia"
                    errorMessage={errors.depositValue?.message}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium mb-3">
                  Seleção rápida
                </label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant={
                        depositValue === quickAmount ? "default" : "secondary"
                      }
                      size="sm"
                      onClick={() =>
                        setValue("depositValue", quickAmount, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className="text-xs"
                    >
                      R${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Sua carteira atual
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(wallet?.balance ?? 0)}
                </p>
                {depositValue > 0 && (
                  <p className="text-sm text-primary">
                    Depois do depósito:{" "}
                    {formatCurrency((wallet?.balance ?? 0) + depositValue)}
                  </p>
                )}
              </div>

              <StateButton
                className="w-full h-12 text-base font-medium"
                isLoading={isLoading}
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Depositar {depositValue ? formatCurrency(depositValue) : ""}
              </StateButton>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 text-center">
                <p className="text-sm text-muted-foreground">Novo saldo</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(wallet?.balance ?? 0)}
                </p>
              </div>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Redirecionando para o dashboard...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
