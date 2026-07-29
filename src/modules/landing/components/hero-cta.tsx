"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";

export function HeroCta() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <Button
      size="lg"
      render={<Link href={user ? "/dashboard" : "/register"} />}
      className="h-11 gap-2 bg-gradient-to-r from-blue-500 to-violet-500 px-6 text-white shadow-lg shadow-blue-500/25 hover:opacity-90"
    >
      {user ? "Go to Dashboard" : "Get Started Free"}
      <ArrowRightIcon className="size-4" />
    </Button>
  );
}
