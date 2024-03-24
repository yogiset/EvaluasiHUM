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
  tercapai: z.coerce.number().nonnegative(),
  salesDetailDtoList: z
    .object({
      bulan: z.string(),
      targetbln: z.coerce.number().nonnegative(),
      tercapaii: z.coerce.number().nonnegative(),
    })
    .optional()
    .array(),
});
