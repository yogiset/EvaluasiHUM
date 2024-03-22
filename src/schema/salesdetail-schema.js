import { z } from "zod";

export const salesdetailSchema = z.object({
  bulan: z
    .string({ required_error: "bulan is required!" })
    .min(5, { message: "Bulan must be at least 5 character." }),
  targetbln: z.coerce.number({ required_error: "Targetbln is required!" }),
  tercapaii: z.coerce.number({
    required_error: "Please select a Percentage!",
    invalid_type_error: "Please select a Percentage!",  
  }),
  tercapaipersenn: z
  .string({ required_error: "tercapaipersen is required!" })
  .min(3, { message: "tercapaipersen must be at least 3 characters." }),
});
