import { z } from "zod";

export const taskFormSchema = z
  .object({
    columnId: z.string().min(1, "Please select a column"),
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(2000).optional().or(z.literal("")),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    type: z.enum(["TASK", "BUG", "STORY", "EPIC"]),
    startDate: z.string().optional().or(z.literal("")),
    dueDate: z.string().optional().or(z.literal("")),
  })
  .refine(
    (values) =>
      !values.startDate || !values.dueDate || values.startDate <= values.dueDate,
    {
      message: "Start date must be before due date",
      path: ["startDate"],
    },
  );

export type TaskFormValues = z.infer<typeof taskFormSchema>;
