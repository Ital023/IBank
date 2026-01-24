"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Landmark,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
import { Input } from "@/components/ui/input";
import { InputBlock } from "@/components/shared/input-block";
import z from "zod";
import { formatCPF, isValidCPF } from "@/hooks/use-cpf";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StateButton } from "@/components/shared/state-button";
import axios from "axios";
import { toast } from "sonner";
import { createWallet } from "@/service/wallet-service";

export default function CreateWalletPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { wallet, setWallet } = useWallet();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWalletSchema>({
    resolver: zodResolver(createWalletSchema),
  });

  async function handleCreateWallet({ cpf, email, name }: CreateWalletSchema) {
    try {
      setIsLoading(true);
      console.log("teste");
      

      const sucess = await createWallet(cpf, email, name);

      if (!sucess) {
        toast.warning("Não foi possivel criar a carteira");
        return;
      }
      toast.success("Carteira criada! Por favor entre com seu e-mail!");
      router.push("/")
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

  // useEffect(() => {
  //   if (!wallet) {
  //     router.push("/")
  //   }
  // }, [user, isLoading, router])

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border/50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              QuickBank
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-primary" />
              ) : (
                <Wallet className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {isSuccess ? "Carteira criada!" : "Criar sua carteira na IBank"}
              </CardTitle>
              <CardDescription>
                {isSuccess
                  ? "Your digital wallet is ready. Redirecting to dashboard..."
                  : ``}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSuccess && (
                <form
                  onSubmit={handleSubmit(handleCreateWallet)}
                  className="space-y-4"
                >
                  <div>
                    <InputBlock
                      register={register}
                      name="cpf"
                      label="CPF"
                      onChange={(e) => {
                        e.target.value = formatCPF(e.target.value);
                      }}
                      placeholder="Digite seu CPF"
                      className="h-12 bg-input/50 border-border/50 placeholder:text-muted-foreground/50"
                      errorMessage={errors.cpf?.message}
                    />
                  </div>

                  <div>
                    <InputBlock
                      register={register}
                      name="name"
                      label="Nome"
                      placeholder="Digite seu Nome"
                      className="h-12 bg-input/50 border-border/50 placeholder:text-muted-foreground/50"
                      errorMessage={errors.name?.message}
                    />
                  </div>

                  <div>
                    <InputBlock
                      register={register}
                      type="email"
                      name="email"
                      label="Email"
                      placeholder="Digite seu Email"
                      className="h-12 bg-input/50 border-border/50 placeholder:text-muted-foreground/50"
                      errorMessage={errors.email?.message}
                    />
                  </div>
                  <StateButton className="w-full h-12 text-base font-medium" isLoading={isLoading}>
                    Criar Carteira
                  </StateButton>
                </form>
            )}

            {isSuccess && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
