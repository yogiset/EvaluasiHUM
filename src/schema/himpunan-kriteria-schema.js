import { z } from "zod";

export const himpunankriteriaSchema = z.object({
  nmkriteria: z
    .string({
      required_error: "nama kriteria is required!",
      invalid_type_error: "nama kriteria is required!",
    })
    .min(4, { message: "nama kriteria must be at least 4 characters." }),
  nmhimpunan: z
    .string({
      required_error: "Nama himpunan is required!",
      invalid_type_error: "Nama himpunan is required!",
    })
    .min(4, { message: "Nama himpunan must be at least 4 characters." }),
  nilai: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Nilai must be a positive value." }),
  keterangan: z
    .string({
      required_error: "Keterangan himpunan is required!",
      invalid_type_error: "Keterangan himpunan is required!",
    })
    .min(4, { message: "Keterangan must be at least 4 characters." }),
});
