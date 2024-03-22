import { z } from "zod";

export const salesSchema = z.object({
  nik: z
    .string({ required_error: "NIK is required!" })
    .min(3, { message: "NIK must be at least 3 characters." }),
  target: z.coerce
    .number({ required_error: "Target is required!" })
    .nonnegative({ message: "Target must be a positive value." }),
  tahun: z.coerce.number({
    required_error: "Please select a Year!",
    invalid_type_error: "Please select a Year!",  
  }),
  tercapai: z.coerce.number({
    required_error: "Please select a Percentage!",
    invalid_type_error: "Please select a Percentage!",  
  }),
  tercapaipersen: z
  .string({ required_error: "tercapaipersen is required!" })
  .min(3, { message: "tercapaipersen must be at least 3 characters." }),
});
