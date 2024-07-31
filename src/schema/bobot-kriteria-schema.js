import { z } from "zod";

export const bobotkriteriaSchema = z.object({
  nmkriteria: z
    .string({
      required_error: "nama kriteria is required!",
      invalid_type_error: "nama kriteria is required!",
    })
    .min(3, { message: "nama kriteria must be at least 3 characters." }),
    bobot: z.coerce.number({
        required_error: "Please fill a bobot!",
        invalid_type_error: "Please fill a bobot!",
      }),
});
