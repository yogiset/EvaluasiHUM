import { z } from "zod";

export const rankingSchema = z.object({
    nama: z
        .string({ required_error: "Nama is required!" })
        .min(3, { message: "Nama must be at least 3 characters." }),
    tahun: z.coerce.number({
        required_error: "Please select a Year!",
        invalid_type_error: "Please select a Year!",
    }),
    achivementtotal: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
    achivementgadus: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
    achivementpremium: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
    jumcustomer: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
    jumvisit: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
    hasil: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
    rank: z.coerce
        .number({ required_error: "Target is required!" })
        .nonnegative({ message: "Target must be a positive value." }),
});
