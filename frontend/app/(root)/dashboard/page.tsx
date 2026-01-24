"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowDownToLine, 
  ArrowRightLeft, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useWallet } from "@/hooks/use-wallet"
import { DashboardLayout } from "@/components/shared/dashboard-layout"

export default function DashboardPage() {
  const { wallet, setWallet } = useWallet()
  // const [transactions, setTransactions] = useState<Transaction[]>([])


  // useEffect(() => {
  //   async function loadData() {
  //     if (!user?.email) return
      
  //     // Refresh wallet balance
  //     const { data: wallet } = await getWallet(user.email)
  //     if (wallet) {
  //       setUser({ ...user, balance: wallet.balance })
  //     }
      
  //     // Load transactions
  //     const { data: txns } = await getTransactions(user.email)
  //     if (txns) {
  //       setTransactions(txns)
  //     }
  //     setIsLoadingData(false)
  //   }
    
  //   loadData()
  // }, [user]) // Updated dependency to user

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD"
  //   }).format(amount)
  // }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit"
  //   })
  // }

  // const getTransactionIcon = (type: Transaction["type"]) => {
  //   switch (type) {
  //     case "DEPOSIT":
  //       return <ArrowDownToLine className="w-4 h-4" />
  //     case "TRANSFER":
  //       return <ArrowRightLeft className="w-4 h-4" />
  //     default:
  //       return <Wallet className="w-4 h-4" />
  //   }
  // }

  return (
      <div className="space-y-8">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <CardHeader className="relative">
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
              {/* {formatCurrency(user?.balance ?? 0)} */}
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
            {/* <span className="text-sm text-muted-foreground">{transactions.length} transactions</span> */}
          </div>
          
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
