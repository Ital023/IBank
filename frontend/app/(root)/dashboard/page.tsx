"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownToLine,
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/use-wallet";
import { getWalletWithStatements } from "@/service/wallet-service";
import {
  Statement,
  StatementOperationEnum,
  StatementSchema,
} from "@/schema/statement.schema";
import z from "zod";
import { useCurrency } from "@/hooks/use-currency";
import { useDate } from "@/hooks/use-date";

export default function DashboardPage() {
  const { formatCurrency } = useCurrency();
  const { formatDateTime } = useDate();

  const { wallet } = useWallet();
  const [statements, setStatements] = useState<Statement[]>([]);

  useEffect(() => {
    const fetchWalletStatements = async () => {
      if (wallet?.walletId) {
        const response = await getWalletWithStatements(wallet.walletId);
        const parsedStatements = z
          .array(StatementSchema)
          .parse(response.statements);
        setStatements(parsedStatements);
      }
    };
    fetchWalletStatements();
  }, [wallet?.walletId]);

  const getStatementIcon = (operation: Statement["operation"]) => {
    switch (operation) {
      case StatementOperationEnum.enum.CREDIT:
        return <ArrowDownToLine className="w-4 h-4" />;
      case StatementOperationEnum.enum.DEBIT:
        return <ArrowRightLeft className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="relative">
          <CardDescription>Available Balance</CardDescription>
          <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            {formatCurrency(wallet?.balance ?? 0)}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="w-4 h-4 text-primary" />
            <span>Wallet ID: {wallet?.walletId || "Not set"}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <span className="text-sm text-muted-foreground">
            {statements.length} transactions
          </span>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {statements.map((statement) => (
                <div
                  key={statement.statementId}
                  className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        statement.value > 0 &&
                          statement.operation ===
                            StatementOperationEnum.enum.CREDIT
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {getStatementIcon(statement.operation)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{statement.literal}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(statement.datetime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-row gap-2">
                    <p
                      className={cn(
                        "font-semibold",
                        statement.value > 0 &&
                          statement.operation ===
                            StatementOperationEnum.enum.CREDIT
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    >
                      {statement.value > 0 &&
                      statement.operation === StatementOperationEnum.enum.CREDIT
                        ? "+"
                        : "-"}
                      {formatCurrency(statement.value)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      {statement.value > 0 &&
                      statement.operation ===
                        StatementOperationEnum.enum.CREDIT ? (
                        <TrendingUp className="w-3 h-3 text-primary" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
