import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters"),
  type: z.enum(["KANBAN", "SCRUM"], {
    message: "Please select a workspace type",
  }),
  description: z.string().max(1000).optional(),
  avatarEmoji: z.string().optional(),
  avatarColor: z.string().optional(),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
