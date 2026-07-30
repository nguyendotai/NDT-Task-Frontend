import { z } from "zod";

export const sprintFormSchema = z
  .object({
    name: z.string().min(1, "Sprint name is required").max(100),
    goal: z.string().max(2000).optional().or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((values) => values.startDate < values.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type SprintFormValues = z.infer<typeof sprintFormSchema>;
