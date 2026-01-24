export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) firstCheck = 0;
  if (firstCheck !== digits[9]) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }

  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) secondCheck = 0;
  if (secondCheck !== digits[10]) return false;

  return true;
}

export const formatCPF = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);

  return onlyNumbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};
