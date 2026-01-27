import * as z from "zod";

export const formSchema = z.object({
  device: z.enum(["BME_HUNITY", "ONIONSAT_TEST", "SLOTH"], {
    errorMap: () => ({ message: "Kérjük válasszon eszközt" }),
  }),
  type: z.string().min(1, "Kérjük válasszon típust"),
  execDate: z.string().min(1, "Kérjük adjon meg végrehajtás dátumot"),
  communicationWindow: z
    .string()
    .min(1, "Kérjük válasszon kommunikációs ablakot"),
});

export const RESOLUTION_VALUES = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024] as const


export const requestMeasurementSchema = z.object({
  timestamp: z.coerce.number()
      .min(0)
      .max(4294967295),
  continue_with_full_channel: z.boolean(),
  header_packet: z.boolean(),
});

export const requestSelftestSchema = z.object({
  timestamp: z.coerce.number()
      .min(0)
      .max(4294967295)

});

export const setDurSchema = z.object({
  repetitions: z.coerce.number()
      .min(1)
      .max(63),
  mode: z.enum(["MAX_HITS", "MAX_TIME"]),
  okaying: z.boolean(),
  duration: z.coerce.number()
      .min(1)
      .max(65535),
  breaktime: z.coerce.number()
      .min(1)
      .max(65535),
});

export const setScaleSchema = z.object({
  lowerThreshold: z.coerce.number()
      .min(0)
      .max(4094),
  upperThreshold: z.coerce.number()
      .min(1)
      .max(4095),
  resolution: z.coerce.number().refine(
      (val) => RESOLUTION_VALUES.includes(val as typeof RESOLUTION_VALUES[number]),
      { message: "Resolution must be one of: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024" }
  ),
  sample: z.coerce.number()
      .min(1)
      .max(255),
}).refine(
    (data) => data.lowerThreshold < data.upperThreshold,
    {
      message: "A mérési tartomány minimumának kisebbnek kell lennie, mint a maximum",
      path: ["upperThreshold"],
    }
);

export type FormValues = z.infer<typeof formSchema>;
export type RequestMeasurementValues = z.infer<typeof requestMeasurementSchema>;
export type RequestSelftestValues = z.infer<typeof  requestSelftestSchema>
export type SetDurValues = z.infer<typeof setDurSchema>;
export type SetScaleValues = z.infer<typeof setScaleSchema>;
