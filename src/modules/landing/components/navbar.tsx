"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboardIcon,
  LayoutGridIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { clearCredentials, selectCurrentUser, useLogoutMutation } from "@/features/auth";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- avatar Cloudinary domain chưa cấu hình next/image
    return <img src={avatarUrl} alt={name} className="size-9 rounded-full object-cover" />;
  }
  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Bỏ qua lỗi API logout — vẫn xoá phiên phía client để đảm bảo UX.
    }
    dispatch(clearCredentials());
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <LayoutGridIcon className="size-4.5" />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-sm font-bold tracking-wide">NDT</span>
            <span className="block text-[10px] font-medium tracking-widest text-muted-foreground">
              TASK
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button type="button" aria-label="Tài khoản">
                    <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center gap-2.5 px-2 py-2">
                  <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile" />} className="py-1.5">
                  <UserIcon className="text-muted-foreground" />
                  Hồ sơ của tôi
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard" />} className="py-1.5">
                  <LayoutDashboardIcon className="text-muted-foreground" />
                  Go to Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="py-1.5"
                  onClick={handleLogout}
                >
                  <LogOutIcon />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />}>
                Login
              </Button>
              <Button
                render={<Link href="/register" />}
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex size-9 items-center justify-center rounded-lg text-foreground"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Hồ sơ của tôi
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Go to Dashboard
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" render={<Link href="/login" />}>
                    Login
                  </Button>
                  <Button
                    render={<Link href="/register" />}
                    className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
