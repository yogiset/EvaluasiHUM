import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username is required!",
      invalid_type_error: "Username is required!",
    })
    .min(3, {
      message: "Username is to short!",
    })
    .max(50, {
      message: "Username is to long!",
    }),
  password: z
    .string({
      required_error: "Password is required!",
      invalid_type_error: "Password is required!",
    })
    .min(6, {
      message: "Password is to short!",
    }),
});
