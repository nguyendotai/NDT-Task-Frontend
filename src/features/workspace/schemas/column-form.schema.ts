import { z } from "zod";

export const columnFormSchema = z.object({
  name: z.string().min(1, "Column name is required").max(100),
  // "NONE" là sentinel cho "không map status" (Select không nhận value rỗng/null).
  mappedStatus: z.enum(["NONE", "TODO", "IN_PROGRESS", "DONE"]),
});

export type ColumnFormValues = z.infer<typeof columnFormSchema>;
