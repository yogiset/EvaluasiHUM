import { z } from "zod";

export const employeeSchema = z.object({
  nik: z
    .string({
      required_error: "NIK is required!",
      invalid_type_error: "NIK is required!",
    })
    .min(3, { message: "NIK must be at least 3 characters." }),
  nama: z
    .string({
      required_error: "Name is required!",
      invalid_type_error: "Name is required!",
    })
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name is to long!" }),
  divisi: z.string({
    required_error: "Please select a division!",
    invalid_type_error: "Please select a division!",
  }),
  jabatan: z.string({
    required_error: "Please select a position!",
    invalid_type_error: "Please select a position!",
  }),
  email: z
    .string({
      required_error: "Email is required!",
      invalid_type_error: "Email is required!",
    })
    .email("Please enter an email.")
    .min(5, { message: "Email must be at least 5 characters." })
    .max(50, { message: "Email is to long!" }),
  tanggalmasuk: z.coerce.date({
    required_error: "Entry date is required.",
  }),
});
