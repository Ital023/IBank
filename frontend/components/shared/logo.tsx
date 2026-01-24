import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string
}

const Logo = ({className}: LogoProps) => {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/logo.png"
        alt="logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
