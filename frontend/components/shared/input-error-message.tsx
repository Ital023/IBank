import { CircleAlert } from "lucide-react";

interface ErrorInputProps {
  errorMessage: string;
}
export function InputErrorMessage({ errorMessage }: ErrorInputProps) {
  return (
    <div className={`${errorMessage ? "block" : "hidden"} text-red-600 text-xs flex items-center gap-2 mt-1`}>
     <CircleAlert size={12}/> {errorMessage ? errorMessage : ""}
    </div>
  );
}