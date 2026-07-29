import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Tên Workspace tối thiểu 3 ký tự"),
  type: z.enum(["KANBAN", "SCRUM"], {
    message: "Vui lòng chọn loại Workspace",
  }),
  description: z.string().max(1000).optional(),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
