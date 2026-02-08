
import * as z from "zod";
import {Constants } from "@repo/supabase/database.types";


export const missionFormSchema = z.object({
    missionName: z.string().min(1, "A küldetés neve kötelező"),
    device: z.enum(["BME_HUNITY", "ONINSAT_TEST", "SLOTH"]),
    type: z.enum(["MAX_HITS", "MAX_TIME"]),
    measureRange: z.array(z.number()).length(2),
    sampling:  z.transform(Number).pipe(z.number().min(0)),
    resolution: z.string(),
    measureLength: z.transform(Number).pipe(z.number().min(0)),
    okezas: z.boolean(),
    headerPacket: z.boolean(),
    continueOnFull: z.boolean(),
})

export const NewMissionSchema = z.object({
    name: z.string({ error: "Invalid name!" }),
    device: z.enum(Constants["public"]["Enums"]["device"], {
        error: "Invalid device",
    }),
    settings: z.object({
        type: z.enum(["MAX_HITS", "MAX_TIME"], { error: "Invalid type" }),
        is_okay: z.boolean(),
        is_header: z.boolean(),
        continue_with_full_channel: z.boolean(),
        duration: z
            .number({ error: "Duration setting should be a number" })
            .min(0, { error: "Duration must be bigger than 0" })
            .max(65536, { error: "Duration must be less than 65536" }),
        min_voltage: z
            .number({ error: "Min voltage should be a number" })
            .min(0, { error: "Min voltage must be bigger than 0" })
            .max(4096, { error: "Min voltage must be less than 4096" }),
        max_voltage: z
            .number({ error: "Max voltage should be a number" })
            .min(0, { error: "Max voltage must be bigger than 0" })
            .max(4096, { error: "Max voltage must be less than 4096" }),
        samples: z
            .number({ error: "Samples should be a number" })
            .min(0, { error: "Samples must be bigger than 0" })
            .max(256, { error: "Samples must be less than 256" }),
        resolution: z
            .number({ error: "Resolution should be a number" })
            .min(0, { error: "Resolution must be bigger than 0" })
            .lte(1024, { error: "Resolution must be less or equal than 1024" })
            .refine((val) => (val & (val - 1)) == 0, {
                error: "Resolution must be a power of two",
            }),
    }),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>
export type dataForAPI = z.infer<typeof NewMissionSchema>