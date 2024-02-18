import { z } from "zod";

export const ruleSchema = z.object({
  koderule: z
    .string({
      required_error: "Kode rule is required!",
      invalid_type_error: "Kode rule is required!",
    })
    .min(3, { message: "Kode rule must be at least 3 characters." }),
  rule: z
    .string({
      required_error: "Rule is required!",
      invalid_type_error: "Rule is required!",
    })
    .min(3, { message: "Rule must be at least 3 characters." }),
  divisi: z.string({
    required_error: "Please select a division!",
  }),
});
