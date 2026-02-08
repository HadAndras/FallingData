"use client";


import NewMissionForm, {LoadMissionView} from "./mission_form.tsx";

import type { MissionFormValues, dataForAPI } from "./mission_schemas.ts";
import { redirect } from "next/navigation";

export default function missionSchedulePage() {
    const onSubmit = (data: MissionFormValues) => {
        console.log("Form submitted:", data);
        const out: dataForAPI = {
            name: data.missionName,
            device: "BME_HUNITY",
            settings: {
                type: data.type,
                is_okay: data.okezas,
                is_header: data.headerPacket,
                continue_with_full_channel: data.continueOnFull,
                duration: data.measureLength,
                min_voltage: data.measureRange[0],
                max_voltage: data.measureRange[1],
                samples: data.sampling,
                resolution: Number(data.resolution),
            }
        }
        switch (data.device){
            case "BME_HUNITY":
                out.device = "BME_HUNITY";
                break
            case "ONINSAT_TEST":
                out.device = "ONIONSAT_TEST";
                break
            case "SLOTH":
                out.device = "SLOTH";
                break
        }
        LoadMissionView(out)
            .then((id) =>
            redirect(`/missions/${id}`),);

    };


    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl">
                <NewMissionForm onSubmit={onSubmit} />

            </div>
        </div>
    );
}
