import { z } from "zod";

export const columnFormSchema = z.object({
  name: z.string().min(1, "Column name is required").max(100),
  isDoneColumn: z.boolean(),
});

export type ColumnFormValues = z.infer<typeof columnFormSchema>;
