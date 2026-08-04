import Image from "next/image";
import { cn } from "@/shared/lib/utils";

export function Logo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="NDT Task"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      priority
    />
  );
}
