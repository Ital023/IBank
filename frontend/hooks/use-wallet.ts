import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

export function useWallet() {
  return useContext(AuthContext);
}
