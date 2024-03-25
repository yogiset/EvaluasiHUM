import { z } from "zod";

export const salesDetailSchema = z.object({
  bulan: z.string({ required_error: "Bulan is required!" }),
  targetbln: z.coerce.number({ required_error: "Targetbln is required!" }),
  tarcapaii: z.coerce.number({
    required_error: "Please enter something into this field",
  }),
});
