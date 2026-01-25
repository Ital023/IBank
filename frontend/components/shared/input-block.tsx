import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { InputErrorMessage } from "./input-error-message";
import { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DollarSign, Mail } from "lucide-react";

interface InputBlockProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  icon?: ReactNode;
}

export function InputBlock<T extends FieldValues>({
  errorMessage,
  label,
  placeholder,
  register,
  name,
  icon,
  ...rest
}: InputBlockProps<T>) {
  return (
    <div className="flex flex-col">
      <Label className="mb-4">
        {label}
      </Label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>

        <Input
          className="mb-2"
          placeholder={placeholder ?? ""}
          {...register(name, {
            valueAsNumber: rest.type === "number",
          })}
          {...rest}
        />
      </div>
      <InputErrorMessage errorMessage={errorMessage ?? ""} />
    </div>
  );
}
