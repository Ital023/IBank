import { ToasterProvider } from "@/components/providers/toaster-provider";
import { DashboardLayout } from "@/components/shared/dashboard-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      {children}
      <ToasterProvider />
    </DashboardLayout>
  );
}
