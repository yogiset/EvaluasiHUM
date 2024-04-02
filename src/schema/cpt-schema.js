import { z } from "zod";

export const cptSchema = z.object({
  nik: z
    .string({ required_error: "NIK is required!" })
    .min(3, { message: "NIK must be at least 3 characters." }),
  tahun: z.coerce.number({
    required_error: "Please select a Year!",
    invalid_type_error: "Please select a Year!",
  }),
  panolcustomer: z.coerce
    .number({ required_error: "Panolcustomer is required!" })
    .nonnegative({ message: "Panolcustomer must be a positive value." }),
  coverage: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Coverage must be a positive value." }),
  coveragepersen: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Coverage Persen must be a positive value." }),
  penetration: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Penetration must be a positive value." }),
  throughput: z
    .string({ required_error: "Throughput is required!" })
    .min(1, { message: "Throughput must be at least 1 characters." }),
  hitrate: z.coerce
    .number({
      required_error: "Please fill this field!",
    })
    .nonnegative({ message: "Hitrate must be a positive value." }), 
});
