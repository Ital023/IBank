import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

interface StateButton {
  className: string;
  children: ReactNode;
  isLoading: boolean;
  type?: "button" | "submit" | "reset";
}

export function StateButton({ className, children, isLoading,  type = "button" }: StateButton) {
  return (
    <Button type={type} size={"lg"} className={cn("w-full", className)}>
      {isLoading ? (
        <>
          <Spinner /> Carregando
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}
