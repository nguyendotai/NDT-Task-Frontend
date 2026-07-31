"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser, selectIsBootstrapped } from "@/features/auth";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useAcceptInvitationMutation, useRejectInvitationMutation } from "@/features/workspace";

type ViewState =
  | { step: "idle" }
  | { step: "accepted"; workspaceId: string }
  | { step: "rejected" }
  | { step: "error"; message: string };

export function InvitationAcceptView({ token }: { token: string }) {
  const router = useRouter();
  const isBootstrapped = useAppSelector(selectIsBootstrapped);
  const currentUser = useAppSelector(selectCurrentUser);
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();
  const [rejectInvitation, { isLoading: isRejecting }] = useRejectInvitationMutation();
  const [state, setState] = useState<ViewState>({ step: "idle" });

  useEffect(() => {
    if (isBootstrapped && !currentUser) {
      router.replace(`/login?redirect=${encodeURIComponent(`/invitations/${token}`)}`);
    }
  }, [isBootstrapped, currentUser, router, token]);

  const handleAccept = async () => {
    try {
      const result = await acceptInvitation(token).unwrap();
      setState({ step: "accepted", workspaceId: result.workspaceId });
    } catch (error) {
      setState({ step: "error", message: getApiErrorMessage(error as never) });
    }
  };

  const handleReject = async () => {
    try {
      await rejectInvitation(token).unwrap();
      setState({ step: "rejected" });
    } catch (error) {
      setState({ step: "error", message: getApiErrorMessage(error as never) });
    }
  };

  if (!isBootstrapped || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        {state.step === "idle" ? (
          <>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Lời mời tham gia Workspace
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Bạn được mời tham gia một Workspace trên NDT Task. Bấm Tham gia để chấp
              nhận bằng tài khoản <span className="font-medium text-foreground">{currentUser.email}</span>.
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                type="button"
                className="flex-1"
                disabled={isAccepting || isRejecting}
                onClick={handleAccept}
              >
                {isAccepting ? "Đang tham gia..." : "Tham gia"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isAccepting || isRejecting}
                onClick={handleReject}
              >
                {isRejecting ? "Đang từ chối..." : "Từ chối"}
              </Button>
            </div>
          </>
        ) : null}

        {state.step === "accepted" ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2Icon className="size-10 text-green-500" />
            <h1 className="font-heading text-xl font-bold text-foreground">
              Tham gia thành công
            </h1>
            <p className="text-sm text-muted-foreground">
              Bạn đã trở thành thành viên của Workspace này.
            </p>
            <Button className="mt-2 w-full" onClick={() => router.push(`/workspaces/${state.workspaceId}`)}>
              Đi tới Workspace
            </Button>
          </div>
        ) : null}

        {state.step === "rejected" ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <XCircleIcon className="size-10 text-muted-foreground" />
            <h1 className="font-heading text-xl font-bold text-foreground">Đã từ chối lời mời</h1>
            <p className="text-sm text-muted-foreground">
              Bạn có thể yêu cầu người quản trị Workspace mời lại sau nếu đổi ý.
            </p>
            <Button
              variant="outline"
              className="mt-2 w-full"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Về Dashboard
            </Button>
          </div>
        ) : null}

        {state.step === "error" ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <XCircleIcon className="size-10 text-destructive" />
            <h1 className="font-heading text-xl font-bold text-foreground">Không thể xử lý lời mời</h1>
            <p className="text-sm text-destructive">{state.message}</p>
            <Button
              variant="outline"
              className="mt-2 w-full"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Về Dashboard
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
