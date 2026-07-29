"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch: theme thật chỉ biết được sau khi mount ở client
  // (đây là pattern chuẩn của next-themes, không thể thay bằng subscription).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Đổi giao diện sáng/tối">
            {mounted && theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : mounted && theme === "light" ? (
              <SunIcon className="size-4" />
            ) : (
              <MonitorIcon className="size-4" />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
            <option.icon className="size-4" />
            {option.label}
            {mounted && theme === option.value ? (
              <CheckIcon className="ml-auto size-4" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
