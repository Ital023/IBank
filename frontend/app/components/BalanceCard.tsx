import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "@/schema/wallet.schema";

interface BalanceCardProps {
  wallet: Wallet | null;
  isLoading?: boolean;
}

export const BalanceCard = ({ wallet, isLoading }: BalanceCardProps) => {
  return (
    <Card className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">Account</span>
          </div>
          <span className="text-sm font-mono opacity-90">{wallet?.email}</span>
        </div>
        
        <div className="mb-2">
          <p className="text-sm opacity-80">Welcome back,</p>
          <p className="text-xl font-semibold">{wallet?.name}</p>
        </div>
        
        <div className="mt-6">
          <p className="text-sm opacity-80">Available Balance</p>
          {isLoading ? (
            <div className="h-9 w-32 bg-primary-foreground/20 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-3xl font-bold">
              ${wallet?.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};