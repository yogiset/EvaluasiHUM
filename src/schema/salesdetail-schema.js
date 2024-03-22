import { z } from "zod";

export const salesdetailSchema = z.object({
  bulan: z
    .string({ required_error: "bulan is required!" })
    .min(5, { message: "Bulan must be at least 5 character." }),
  targetbln: z.coerce.number({ required_error: "Targetbln is required!" }),
});
