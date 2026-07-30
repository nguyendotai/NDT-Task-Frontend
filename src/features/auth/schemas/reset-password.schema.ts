import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
