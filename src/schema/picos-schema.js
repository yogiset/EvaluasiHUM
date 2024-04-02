import { z } from "zod";

export const picosSchema = z.object({
  nik: z
    .string({ required_error: "NIK is required!" })
    .min(3, { message: "NIK must be at least 3 characters." }),
  tahun: z.coerce.number({
    required_error: "Please select a Year!",
    invalid_type_error: "Please select a Year!",
  }),
  bulan: z
    .string({ required_error: "bulan is required!" })
    .min(5, { message: "bulan must be at least 5 characters." }),
  pipelinestrength: z.coerce
    .number({ required_error: "Pipelinestrength is required!" })
    .nonnegative({ message: "Pipelinestrength must be a positive value." }),
  lowtouchratio: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Lowtouchratio must be a positive value." }),
  crosssellratio: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Crosssellratio Persen must be a positive value." }),
  penetration: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Penetration must be a positive value." }),
  premiumcontribution: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Premiumcontribution must be a positive value." }),
});
