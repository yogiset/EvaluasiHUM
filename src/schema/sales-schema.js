import { z } from "zod";

export const salesSchema = z.object({
  target: z.coerce.number({ required_error: "Target is required!" }),
  tahun: z.coerce.number({
    required_error: "Please select a Tahun!",
    invalid_type_error: "Please select a Tahun!",
  }),
});
