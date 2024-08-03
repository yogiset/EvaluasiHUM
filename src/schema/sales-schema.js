import { z } from "zod";

export const salesSchema = z.object({
  nik: z
    .string({ required_error: "NIK is required!" })
    .min(3, { message: "NIK must be at least 3 characters." }),
  tahun: z.coerce.number({
    required_error: "Please select a Year!",
    invalid_type_error: "Please select a Year!",
  }),
  targettotal: z.coerce
    .number({ required_error: "Target is required!" })
    .nonnegative({ message: "Target must be a positive value." }),
  tercapaitotal: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Target must be a positive value." }),
  targetgadus: z.coerce
    .number({ required_error: "Target is required!" })
    .nonnegative({ message: "Target must be a positive value." }),
  tercapaigadus: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Target must be a positive value." }),
  targetpremium: z.coerce
    .number({ required_error: "Target is required!" })
    .nonnegative({ message: "Target must be a positive value." }),
  tercapaipremium: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Target must be a positive value." }),
  jumlahcustomer: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Target must be a positive value." }),
  jumlahvisit: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Target must be a positive value." }),

  salesDetailDtoList: z
    .object({
      id: z.coerce.number().optional(),
      bulan: z.string({ required_error: "Required!" }),
      targetblntotal: z.coerce.number({ required_error: "Required!" }).nonnegative(),
      tercapaiitotal: z.coerce.number({ required_error: "Required!" }).nonnegative(),
      tercapaipersenntotal: z.string().optional(),
      targetblngadus: z.coerce.number({ required_error: "Required!" }).nonnegative(),
      tercapaiigadus: z.coerce.number({ required_error: "Required!" }).nonnegative(),
      tercapaipersenngadus: z.string().optional(),
      targetblnpremium: z.coerce.number({ required_error: "Required!" }).nonnegative(),
      tercapaiipremium: z.coerce.number({ required_error: "Required!" }).nonnegative(),
      tercapaipersennpremium: z.string().optional(),
      jumlahvisit: z.string().optional(),
    })
    .optional()
    .array(),
});