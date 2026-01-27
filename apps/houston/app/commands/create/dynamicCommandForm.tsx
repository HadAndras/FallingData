"use client";

import { useForm } from "react-hook-form";
import apiFetch from "@/lib/api_client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/src/components/form.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/src/components/select.tsx";
import { Input } from "@workspace/ui/src/components/input.tsx";
import { Button } from "@workspace/ui/src/components/button.tsx";
import { Switch } from "@workspace/ui/src/components/switch.tsx";

import {
  requestMeasurementSchema,
  requestSelftestSchema,
  setDurSchema,
  setScaleSchema,
  RESOLUTION_VALUES,
  type FormValues,
  type SetDurValues,
  type RequestMeasurementValues,
  type RequestSelftestValues,
  type SetScaleValues,
} from "./command-schemas";

interface DynamicCommandFormProps {
  submittedData: FormValues;
  onAbort: () => void;
}

interface allSubmitData {
  firstForm: FormValues;
  setDurForm?: SetDurValues | null;
  requestMeasurementForm?: RequestMeasurementValues | null;
  setScaleForm?: SetScaleValues | null;
  requestSelftestForm?: RequestSelftestValues | null;
}

export async function LoadDataView(
  allData: allSubmitData,
): Promise<string | null> {
  console.log(allData);
  try {
    const params =
      allData.requestMeasurementForm ??
      allData.setDurForm ??
      allData.setScaleForm ??
      allData.requestSelftestForm ??
      {};
    const response = await apiFetch(`/commands`, "PUT", {
      ...allData.firstForm,
      params,
    });
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

export const NO_PARAM_COMMANDS = [
  "FORCE_STATUS_REPORT",
  "RESET",
  "RESTART",
  "SAVE",
  "STOP",
];

export function DynamicCommandForm({
  submittedData,
  onAbort,
}: DynamicCommandFormProps) {
  const [formData, setFormData] = useState<allSubmitData>({
    firstForm: submittedData,
    setDurForm: null,
    requestMeasurementForm: null,
    requestSelftestForm: null,
    setScaleForm: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (NO_PARAM_COMMANDS.includes(submittedData.type)) {
      console.log("No parameter command submitted.");
      LoadDataView(formData).then((newId) => {
        if (newId) {
          router.push(`/commands/${newId}`);
        }
      });
    }
  }, []);

  const setDurForm = useForm<SetDurValues>({
    resolver: zodResolver(setDurSchema),
    defaultValues: {
      repetitions: 10,
      mode: "MAX_HITS",
      okaying: false,
      duration: 120,
      breaktime: 125,
    },
  });

  const setScaleForm = useForm<SetScaleValues>({
    resolver: zodResolver(setScaleSchema),
    defaultValues: {
      lowerThreshold: 2000,
      upperThreshold: 3000,
      resolution: 8,
      sample: 125,
    },
  });

  const requestMeasurementForm = useForm<RequestMeasurementValues>({
    resolver: zodResolver(requestMeasurementSchema),
    defaultValues: {
      timestamp: 1748899367,
      continue_with_full_channel: false,
      header_packet: true,
    },
  });

    const requestSelftestForm = useForm<RequestSelftestValues>({
        resolver: zodResolver(requestSelftestSchema),
        defaultValues: {
            timestamp: 1748899367,
        },
    });



  const onSetDurSubmit = async (data: SetDurValues) => {
    console.log("[v0] SET_DUR Form submitted:", { ...submittedData, ...data });
    const updatedFormData = { ...formData, setDurForm: data };
    const newId = await LoadDataView(updatedFormData);
    if (newId) {
      router.push(`/commands/${newId}`);
    }
  };

  const onSetScaleSubmit = async (data: SetScaleValues) => {
    console.log("[v0] SET_SCALE Form submitted:", {
      ...submittedData,
      ...data,
    });
    const updatedFormData = { ...formData, setScaleForm: data };
    const newId = await LoadDataView(updatedFormData);
    console.log("new id: ", {newId});
    if (newId) {
      router.push(`/commands/${newId}`);
    }
  };

  const onRequestMeasurementSubmit = async (data: RequestMeasurementValues) => {
    console.log("[v0] Request measurement Form submitted:", {
      ...submittedData,
      ...data,
    });
    const updatedFormData = { ...formData, requestMeasurementForm: data };
    const newId = await LoadDataView(updatedFormData);
    if (newId) {
      router.push(`/commands/${newId}`);
    }
  };

    const onRequestSelfTestSubmit = async (data: RequestSelftestValues) => {
        console.log("[v0] Request Selftest Form submitted:", {
            ...submittedData,
            ...data,
        });
        const updatedFormData = { ...formData, requestSelftestForm: data };
        const newId = await LoadDataView(updatedFormData);
        if (newId) {
            router.push(`/commands/${newId}`);
        }
    };

  switch (submittedData.type) {
    case "SET_DURATION":
      return (
        <div className="mt-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">SET_DUR Paraméterek</h2>
          <Form {...setDurForm}>
            <form
              onSubmit={setDurForm.handleSubmit(onSetDurSubmit)}
              className="space-y-6"
            >
              <FormField
                control={setDurForm.control}
                name="repetitions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ismétlések száma(1-63): </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-[250px]"
                        placeholder="100"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={setDurForm.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAX_HITS vagy MAX_TIME</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MAX_HITS">MAX_HITS</SelectItem>
                        <SelectItem value="MAX_TIME">MAX_TIME</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={setDurForm.control}
                name="okaying"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>isOkaying</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={setDurForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mérési idő(1-65535): </FormLabel>
                    <Input
                      type="number"
                      className="w-[250px]"
                      placeholder="100"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={setDurForm.control}
                name="breaktime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Szünet a mérések között(1-65535): </FormLabel>
                    <Input
                      type="number"
                      className="w-[250px]"
                      placeholder="100"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" variant="secondary">
                  Parancs Véglegesítése
                </Button>
                <Button type="button" variant="destructive" onClick={onAbort}>
                  Megszakítás
                </Button>
              </div>
            </form>
          </Form>
        </div>
      );

    case "SET_SCALE":
      return (
        <div className="mt-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">SET_SCALE Paraméterek</h2>
          <Form {...setScaleForm}>
            <form
              onSubmit={setScaleForm.handleSubmit(onSetScaleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={setScaleForm.control}
                name="lowerThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A mérési tartomány minimuma(0-4094):</FormLabel>
                    <Input
                      type="number"
                      className="w-[250px]"
                      placeholder="100"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={setScaleForm.control}
                name="upperThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A mérési tartomány maximuma(1-4095):</FormLabel>
                    <Input
                      type="number"
                      className="w-[250px]"
                      placeholder="100"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={setScaleForm.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A mérési tartomány felbontása(1-1024):</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                          <FormControl>
                              <SelectTrigger className="w-[250px]">
                                  <SelectValue placeholder="Válasszon felbontást" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {RESOLUTION_VALUES.map((value) => (
                                  <SelectItem key={value} value={value.toString()}>
                                      {value}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={setScaleForm.control}
                name="sample"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A mintavételezés gyakorisága(1-255): </FormLabel>
                    <Input
                      type="number"
                      className="w-[250px]"
                      placeholder="100"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" variant="secondary">
                  Parancs Véglegesítése
                </Button>
                <Button type="button" variant="destructive" onClick={onAbort}>
                  Megszakítás
                </Button>
              </div>
            </form>
          </Form>
        </div>
      );

    case "REQUEST_MEASUREMENT":
      return (
        <div className="mt-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Request measurement paraméterek
          </h2>
          <Form {...requestMeasurementForm}>
            <form
              onSubmit={requestMeasurementForm.handleSubmit(
                onRequestMeasurementSubmit,
              )}
              className="space-y-6"
            >
              <FormField
                control={requestMeasurementForm.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A mérés kivitelezésének időpontja </FormLabel>
                    <Input
                      type="number"
                      className="w-[250px]"
                      placeholder="100"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={requestMeasurementForm.control}
                name="continue_with_full_channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Byte: </FormLabel>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                    control={requestMeasurementForm.control}
                    name="header_packet"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Header: </FormLabel>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </div>
                        </FormItem>
                    )}
                />
              <div className="flex gap-3">
                <Button type="submit" variant="secondary">
                  Parancs Véglegesítése
                </Button>
                <Button type="button" variant="destructive" onClick={onAbort}>
                  Megszakítás
                </Button>
              </div>
            </form>
          </Form>
        </div>
      );
    case "REQUEST_SELFTEST":
        return (
            <div className="mt-8 p-6 border border-border rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">
                    Request Selftest paraméterek
                </h2>
                <Form {...requestSelftestForm}>
                    <form
                        onSubmit={requestSelftestForm.handleSubmit(
                            onRequestSelfTestSubmit,
                        )}
                        className="space-y-6"
                    >
                        <FormField
                            control={requestSelftestForm.control}
                            name="timestamp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>A mérés kivitelezésének időpontja </FormLabel>
                                    <Input
                                        type="number"
                                        className="w-[250px]"
                                        placeholder="100"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3">
                            <Button type="submit" variant="secondary">
                                Parancs Véglegesítése
                            </Button>
                            <Button type="button" variant="destructive" onClick={onAbort}>
                                Megszakítás
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        )

    case "FORCE_STATUS_REPORT":
    case "RESET":
    case "RESTART":
    case "SAVE":
    case "STOP":
      return (
        <div className="mt-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Parancs küldése...</h2>
          <p className="text-muted-foreground">
            Kérjük várjon, a parancs feldolgozás alatt.
          </p>
        </div>
      );

    default:
      return (
        <div className="mt-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {submittedData.type} Paraméterek
          </h2>
          <p className="text-muted-foreground">
            Ez a parancs típus még nincs implementálva.
          </p>
          <Button
            type="button"
            variant="destructive"
            onClick={onAbort}
            className="mt-4"
          >
            Megszakítás
          </Button>
        </div>
      );
  }
}
