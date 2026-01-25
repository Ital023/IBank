import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { InputErrorMessage } from "./input-error-message";
import { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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
        {icon} {label}
      </Label>
      <Input
        className="mb-2"
        placeholder={placeholder ?? ""}
        {...register(name, {
          valueAsNumber: rest.type === "number",
        })}
        {...rest}
      />
      <InputErrorMessage errorMessage={errorMessage ?? ""} />
    </div>
  );
}
