import { z } from "zod";

export const salesDetailSchema = z.object({
  bulan: z.string({ required_error: "Bulan is required!" }),
  targetblntotal: z.coerce.number({ required_error: "Targetbln is required!" }),
  tarcapaiitotal: z.coerce.number({
    required_error: "Please enter something into this field",
  }),
  targetblngadus: z.coerce.number({ required_error: "Targetbln is required!" }),
  tarcapaiigadus: z.coerce.number({
    required_error: "Please enter something into this field",
  }),
  targetblnpremium: z.coerce.number({ required_error: "Targetbln is required!" }),
  tarcapaiipremium: z.coerce.number({
    required_error: "Please enter something into this field",
  }),
  jumlahvisit: z.coerce.number({ required_error: "Jumlah Visit is required!" }),

});
