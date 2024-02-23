import { z } from "zod";

export const answerSchema = z.object({
  jawaban: z
    .string({ required_error: "Jawaban is required!" })
    .min(1, { message: "Answer must be at least 1 character." }),
  bobot: z.coerce.number({ required_error: "Bobot is required!" }),
});
