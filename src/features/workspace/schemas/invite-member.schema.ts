import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER"], {
    message: "Please select a role",
  }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
