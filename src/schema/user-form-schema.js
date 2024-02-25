import { z } from "zod";

export const userFormSchema = z.object({
  username: z.string({
    required_error: "Username is required!",
  }),
  jabatan: z.string({
    required_error: "Position is required!",
  }),
  nik: z
    .string({
      required_error: "NIK is required!",
    })
    .min(3, { message: "NIK must be at least 3 characters." }),
});
