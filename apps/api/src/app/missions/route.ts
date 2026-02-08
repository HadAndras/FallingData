import { createClient, getUser } from "../../lib/supabase/server";
import { headers } from "next/headers";
import { Enums, Constants } from "@repo/supabase/database.types";
import { check_json_header } from "@/lib/checks";
import * as z from "zod";

const boolToSmallint = z.boolean().transform((b) => (b ? 1 : 0));

const NewMissionSchema = z.object({
  name: z.string({ error: "Invalid name!" }),
  device: z.enum(Constants["public"]["Enums"]["device"], {
    error: "Invalid device",
  }),
  settings: z.object({
    type: z.enum(["MAX_HITS", "MAX_TIME"], { error: "Invalid type" }),
    is_okay: boolToSmallint,
    is_header: boolToSmallint,
    continue_with_full_channel: boolToSmallint,
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

type JSON_INPUT = z.infer<typeof NewMissionSchema>;

export async function PUT(req: Request) {
  try {
    const supa = await createClient();
    const user = await getUser(supa, (await headers()) as Headers);

    let res = await check_json_header(req);
    if (res !== null) return res;
    let json: JSON_INPUT | undefined | null = await req.json();
    if (!json) return new Response("Bad request", { status: 400 });

    const parseResult = NewMissionSchema.safeParse(json);

    if (!parseResult.success)
      return new Response(JSON.stringify(parseResult.error), {
        status: 400,
        statusText: "Bad Request",
      });

    json = parseResult.data;

    if (json.settings.min_voltage > json.settings.max_voltage)
      return new Response(
        JSON.stringify([
          {
            expected: "less",
            code: "invalid_threshold",
            path: ["settings", "min_voltage"],
            message: "Min threshold must be less than max threshold!",
          },
        ]),
        { status: 400 },
      );

    const { data: missionSetting, error: missionSettingError } = await supa
      .from("mission_settings")
      .insert({
        type: json.settings.type,
        is_okay: json.settings.is_okay,
        is_header: json.settings.is_header,
        continue_with_full_channel: json.settings.continue_with_full_channel,
        duration: json.settings.duration,
        min_voltage: json.settings.min_voltage,
        max_voltage: json.settings.max_voltage,
        samples: json.settings.samples,
        resolution: json.settings.resolution,
      })
      .select()
      .single();

    if (missionSettingError) {
      console.error(missionSettingError);
      return new Response("Bad Gateway", { status: 502 });
    }

    const { data: insertedMission, error: insertError } = await supa
      .from("missions")
      .insert({
        name: json.name,
        device: json.device,
        status: "CREATED",
        settings: missionSetting.id,
        createdBy: user.user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      return new Response("Bad Gateway", { status: 502 });
    }
    console.log("hu");
    return new Response(JSON.stringify(insertedMission), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
