import { z } from "zod";

export const updateWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters"),
  description: z.string().max(1000).optional().or(z.literal("")),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export type UpdateWorkspaceFormValues = z.infer<typeof updateWorkspaceSchema>;
