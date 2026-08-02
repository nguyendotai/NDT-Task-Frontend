"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboardIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getInitials } from "@/shared/utils/initials";
import { selectCurrentUser, clearCredentials } from "../store/auth.slice";
import { useLogoutMutation } from "../api/auth.api";

export function UserAvatar({
  name,
  avatarUrl,
  className = "size-9",
}: {
  name: string;
  avatarUrl: string | null;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar Cloudinary domain chưa cấu hình next/image
      <img
        src={avatarUrl}
        alt={name}
        className={`${className} rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white`}
    >
      {getInitials(name)}
    </span>
  );
}

export function AccountMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Bỏ qua lỗi API logout — vẫn xoá phiên phía client để đảm bảo UX.
    }
    dispatch(clearCredentials());
    router.push("/");
  };

  return (
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
  );
}
