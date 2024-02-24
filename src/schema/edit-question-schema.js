import { z } from "zod";

export const editQuestionSchema = z.object({
  rule: z
    .string({
      required_error: "Rule is required!",
    })
    .min(3, { message: "Rule must be at least 3 characters." }),
  pertanyaan: z
    .string({
      required_error: "Question is required!",
    })
    .min(3, { message: "Question must be at least 3 characters." }),
  jabatan: z.string({
    required_error: "Position is required!",
  }),
});
