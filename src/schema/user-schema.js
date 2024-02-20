import { z } from "zod";

export const userSchema = z.object({
  kodeuser: z
    .string()
    .min(3, { message: "Kode user must be at least 3 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50, { message: "Username is to long!" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.string({
    required_error: "Please select a role!",
  }),
  status: z.boolean(),
  nik: z.optional(
    z
      .string({
        required_error: "NIK is required!",
      })
      .min(3, { message: "NIK must be at least 3 characters." })
  ),
});
