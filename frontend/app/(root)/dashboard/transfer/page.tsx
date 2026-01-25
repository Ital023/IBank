"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightLeft,
  CheckCircle2,
  Loader2,
  DollarSign,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { InputBlock } from "@/components/shared/input-block";
import { StateButton } from "@/components/shared/state-button";
import { useCurrency } from "@/hooks/use-currency";
import { transferMoneyByEmail } from "@/service/wallet-service";

export default function TransferPage() {
  const { formatCurrency } = useCurrency();
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { wallet, setWallet } = useWallet();

  const transferSchema = z.object({
    value: z.number(),
    receiver: z.email(),
  });

  type TransferSchema = z.infer<typeof transferSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
  });

  const transferValue = watch("value");
  const recipientEmail = watch("receiver");

  async function handleTransfer({ value, receiver }: TransferSchema) {
    setIsTransferring(true);
    setError("");
    try {
      if (!wallet?.email) {
        throw new Error("Wallet email not found");
      }
      await transferMoneyByEmail(wallet.email, value, receiver);
      wallet.balance -= value;
      setWallet(wallet);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsSuccess(false);
        toast.warning(error.response?.data?.title ?? "Carteira não encontrada");
      } else {
        toast.warning("Erro inesperado");
      }
    } finally {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
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
              <ArrowRightLeft className="w-8 h-8 text-primary" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {isSuccess ? "Transação concluída com sucesso!" : "Transferência"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? `${formatCurrency(transferValue)} sent to ${recipientEmail}`
                : "Envie dinheiro para outra carteira instantaneamente"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit(handleTransfer)} className="space-y-6">
              <div className="space-y-2">
                <InputBlock
                  type="email"
                  placeholder="email@exemplo.com"
                  register={register}
                  name="receiver"
                  label="Chave Email Destinatário"
                  className="h-12 pl-10 bg-input/50 border-border/50"
                  icon={<Mail />}
                />
              </div>

              <div className="space-y-2">
                <InputBlock
                  type="number"
                  placeholder="0.00"
                  className="h-14 pl-10 text-2xl font-semibold bg-input/50 border-border/50"
                  step="0.01"
                  min="0"
                  register={register}
                  name="value"
                  label="Quantia"
                  errorMessage={errors.value?.message}
                  icon={<DollarSign />}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Saldo disponível
                  </p>
                  <p className="font-semibold">
                    {formatCurrency(wallet?.balance ?? 0)}
                  </p>
                </div>
                {transferValue > 0 &&
                  transferValue <= (wallet?.balance ?? 0) && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Após transferência
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {formatCurrency((wallet?.balance ?? 0) - transferValue)}
                      </p>
                    </div>
                  )}
              </div>

              <StateButton
                className="w-full h-12 text-base font-medium"
                isLoading={isLoading}
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Transferir {transferValue ? formatCurrency(transferValue) : ""}
              </StateButton>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Valor enviado</p>
                  <p className="font-semibold">
                    {formatCurrency(transferValue)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium text-sm">{recipientEmail}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">Novo saldo</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(wallet?.balance ?? 0)}
                  </p>
                </div>
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
