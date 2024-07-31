import { z } from "zod";

export const himpunankriteriaSchema = z.object({
  nmkriteria: z
    .string({
      required_error: "nama kriteria is required!",
      invalid_type_error: "nama kriteria is required!",
    })
    .min(3, { message: "nama kriteria must be at least 3 characters." }),
  nmhimpunan: z
    .string({
      required_error: "Nama himpunan is required!",
      invalid_type_error: "Nama himpunan is required!",
    })
    .min(3, { message: "Nama himpunan must be at least 3 characters." }),
    nilai: z.coerce.number({
      required_error: "Please select a nilai!",
      invalid_type_error: "Please select a nilai!",
    }),
  keterangan: z
    .string({
      required_error: "Keterangan himpunan is required!",
      invalid_type_error: "Keterangan himpunan is required!",
    })
    .min(4, { message: "Keterangan must be at least 4 characters." }),
});
