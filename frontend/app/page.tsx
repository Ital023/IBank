import { Wallet, WalletSchema } from "@/schema/wallet.schema";
import { BalanceCard } from "./components/BalanceCard";

export default function Home() {
  const data = {
    walletId: "3817c8b6-4d7c-434f-9752-ea0f32f1a613",
    cpf: "06659177329",
    name: "Davi Cotting",
    email: "davi@gmail.com",
    balance: 0,
  };

  let wallet: Wallet;

  try {
    wallet = WalletSchema.parse(data);
    console.log(wallet);
    
  } catch (error) {
    console.error("❌ Invalid wallet:", error);
    return <div>Invalid wallet data</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center mb-8">
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
