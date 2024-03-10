import { z } from "zod";

export const questionSchema = z.object({
  koderule: z
    .string({
      required_error: "Kode rule is required!",
      invalid_type_error: "Kode rule is required!",
    })
    .min(10, { message: "Kode rule must be at least 10 characters." }),
  rule: z
    .string({
      required_error: "Rule is required!",
      invalid_type_error: "Rule is required!",
    })
    .min(3, { message: "Rule must be at least 3 characters." }),
  kodepertanyaan: z
    .string({
      required_error: "Kode Pertanyaan is required!",
    })
    .min(10, { message: "Kode Pertanyaan must be at least 10 characters." }),
  pertanyaan: z
    .string({
      required_error: "Pertanyaan is required!",
    })
    .min(3, { message: "Pertanyaan must be at least 3 characters." }),
  jabatan: z.string({
    required_error: "Please select a position!",
  }),
});
