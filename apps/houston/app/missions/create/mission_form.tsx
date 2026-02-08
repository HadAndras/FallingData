"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    MissionFormValues,
    type dataForAPI,
    missionFormSchema,
    NewMissionSchema
} from "@/app/missions/create/mission_schemas.ts"
import { Input } from "@workspace/ui/src/components/input.tsx"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/src/components/radio-group.tsx"
import { Slider } from "@workspace/ui/src/components/slider.tsx"
import { Checkbox } from "@workspace/ui/src/components/checkbox.tsx"
import { Button } from "@workspace/ui/src/components/button.tsx"
import { Separator } from "@workspace/ui/src/components/separator.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/src/components/select.tsx"
import Device from "../../../components/device.tsx"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@workspace/ui/src/components/form.tsx"
import apiFetch from "@/lib/api_client.ts";

const devices = [
    { id: "BME_HUNITY" as const },
    { id: "ONIONSAT_TEST" as const },
    { id: "SLOTH" as const },
];

interface MissionScheduleFormProps {
    onSubmit: (data: MissionFormValues) => void;
}

export async function LoadMissionView(
    missionData: dataForAPI,
): Promise<string | null> {
    console.log(missionData);
    try {
        const payload = NewMissionSchema.parse(missionData);
        console.log("Küldött adat:", payload);
        const response = await apiFetch(`/missions`, "PUT", payload);

        const newId = response.id;
        if (!newId) {
            throw new Error("Nem érkezett ID a válaszban");
        }

        return newId;
    } catch (error) {
        console.error("Hiba:", error);
        alert("Sikertelen mentés!");

        return null;
    }
}

export default function NewMissionForm({onSubmit}: MissionScheduleFormProps) {
    const form = useForm<MissionFormValues>({
        resolver: zodResolver(missionFormSchema),
        defaultValues: {
            missionName: "test mission",
            device: "BME_HUNITY",
            type: "MAX_HITS",
            measureRange: [189, 3300],
            sampling: 5,
            resolution: "128",
            measureLength: 4000,
            okezas: true,
            headerPacket: true,
            continueOnFull: false,
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <FormField
                    control={form.control}
                    name="device"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-lg">Eszköz:</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    {devices.map((device) => (
                                        <div
                                            key={device.id}
                                            onClick={() => field.onChange(device.id)}
                                            className={`cursor-pointer rounded-lg transition-all ${
                                                field.value === device.id
                                                    ? "ring-2 ring-blue-500 ring-offset-2"
                                                    : "hover:opacity-80"
                                            }`}
                                        >
                                            <Device device={device.id}/>
                                        </div>
                                    ))}
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Küldetés neve */}
                <FormField
                    control={form.control}
                    name="missionName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Küldetés neve:"}</FormLabel>
                            <FormControl>
                                <Input className="max-w-[200px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Típus */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Típus:"}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex flex-col gap-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="MAX_HITS" id="type-max-hits" />
                                        <FormLabel htmlFor="type-max-hits" className="font-normal cursor-pointer">
                                            MAX_HITS
                                        </FormLabel>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="MAX_TIME" id="type-max-time" />
                                        <FormLabel htmlFor="type-max-time" className="font-normal cursor-pointer">
                                            MAX_TIME
                                        </FormLabel>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Mérési tartomány */}
                <FormField
                    control={form.control}
                    name="measureRange"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Mérési tartomány:"}</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-3 max-w-xs">
                                    <span className="text-sm text-muted-foreground tabular-nums">0</span>
                                    <Slider
                                        min={0}
                                        max={3300}
                                        step={1}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                    <span className="text-sm text-muted-foreground whitespace-nowrap tabular-nums">
                    3300 mV
                  </span>
                                </div>
                            </FormControl>
                            <FormDescription>
                                {field.value[0]} - {field.value[1]} mV a mérési tartomány
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sampling */}
                <FormField
                    control={form.control}
                    name="sampling"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Sampling:"}</FormLabel>
                            <FormControl>
                                <Input type="number" className="max-w-[200px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Felbontás */}
                <FormField
                    control={form.control}
                    name="resolution"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Felbontás:"}</FormLabel>
                            <FormControl>
                                <Select value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                >
                                    <SelectTrigger className="max-w-[200px]">
                                        <SelectValue placeholder="Válassz felbontást" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="8">8</SelectItem>
                                        <SelectItem value="16">16</SelectItem>
                                        <SelectItem value="32">32</SelectItem>
                                        <SelectItem value="64">64</SelectItem>
                                        <SelectItem value="128">128</SelectItem>
                                        <SelectItem value="256">256</SelectItem>
                                        <SelectItem value="512">512</SelectItem>
                                        <SelectItem value="1024">1024</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                {"A küldetés felbontása: "}{field.value[0]}{" csatorna"}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* A mérés hossza */}
                <FormField
                    control={form.control}
                    name="measureLength"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"A mérés hossza (beütés):"}</FormLabel>
                            <FormControl>
                                <Input type="number" className="max-w-[200px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Separator />

                {/* Checkboxok */}
                <div className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="okezas"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="font-semibold cursor-pointer">
                                    {"Okézás"}
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="headerPacket"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="font-semibold cursor-pointer">
                                    Header packet
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="continueOnFull"
                        render={({ field }) => (
                            <FormItem className="flex items-start gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="mt-0.5"
                                    />
                                </FormControl>
                                <div className="flex flex-col gap-0.5">
                                    <FormLabel className="font-normal cursor-pointer">
                                        {"A mérés folytatása azután, hogy betelik egy csatorna"}
                                    </FormLabel>
                                    <FormDescription>
                                        {"Potenciális adatvesztéssel járhat, ugyanis a csatornák nem bővíthetőek"}
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                </div>
                {/* Létrehozás gomb */}
                <div className="pt-4">
                    <Button type="submit" variant="default" className="mt-6">
                        Létrehozás
                    </Button>
                </div>


            </form>
        </Form>
    )
}