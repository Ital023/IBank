"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Zap, CreditCard } from "lucide-react";
import Image from "next/image";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { findWalletByEmail } from "@/service/wallet-service";
import { InputBlock } from "@/components/shared/input-block";
import { StateButton } from "@/components/shared/state-button";
import { toast } from "sonner";
import axios from "axios";
import { useWallet } from "@/hooks/use-wallet";
import Link from "next/link";

export default function HomePage() {
  const { wallet, setWallet } = useWallet();

  const router = useRouter();

  useEffect(() => {
    if (wallet) {
      router.push("/dashboard");
    }
  }, [wallet, router]);

  useEffect(() => {
    const stored = localStorage.getItem("ibank_wallet_user");
    if (stored && wallet === null) {
      setWallet(JSON.parse(stored));
    }
  }, [setWallet, wallet]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailWalletSchema = z.object({
    email: z.email("Email Inválido!"),
  });

  type EmailWalletSchema = z.infer<typeof emailWalletSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailWalletSchema>({
    resolver: zodResolver(emailWalletSchema),
  });

  async function getWallet({ email }: EmailWalletSchema) {
    try {
      setIsLoading(true);
      const response = await findWalletByEmail(email);
      setWallet(response);
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
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="relative w-60 h-20">
              <Image
                src="/logo.png"
                alt="logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Banco sem
                <br />
                <span className="text-primary">complicação.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Acesse sua carteira digital instantaneamente. Deposite,
                transfira e gerencie seu dinheiro de qualquer lugar, a qualquer
                momento.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">Transações seguras</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm">Transferências instantâneas</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-sm">Depósitos fáceis</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
                <CardDescription>
                  Digite seu e-mail para acessar sua carteira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(getWallet)} className="space-y-4">
                  <div className="space-y-2">
                    <InputBlock
                      register={register}
                      name="email"
                      placeholder="Digite seu e-mail"
                      className="h-12 bg-input/50 border-border/50 placeholder:text-muted-foreground/50"
                      errorMessage={errors.email?.message}
                    />
                  </div>
                  <StateButton
                    className="w-full h-12 text-base font-medium"
                    isLoading={isLoading}
                  >
                    Acessar Conta
                  </StateButton>
                </form>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    {"Não tem uma carteira? "}
                    <Link
                      href="/create-wallet"
                      className="text-primary hover:underline font-medium"
                    >
                      Crie uma
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
