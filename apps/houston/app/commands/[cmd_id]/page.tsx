import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@workspace/ui/src/components/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/src/components/table.tsx";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/src/components/avatar.tsx";
import Device from "@/components/device";
export default async function commandDataPage({
  params,
}: {
  params: Promise<{ cmd_id: string }>;
}) {
  const { cmd_id } = await params;
  const supabase = await createClient();
  const { data: command } = await supabase
    .from("commands_table")
    .select("*")
    .eq("id", cmd_id)
    .single();
  const { data: parameters } = await supabase
    .from("commands")
    .select("*")
    .eq("id", cmd_id)
    .single();
  console.log(parameters);

  return (
    <div className="min-h-screen bg-background p-6 dark">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Parancs adatai
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Alapadatok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-foreground">ID: {command.id}</p>
              <p className="text-sm text-foreground">Típus: {command.type}</p>
              <p className="text-sm text-foreground">
                Parancs: {command.command}
              </p>
              <p className="text-sm text-foreground">
                Végrehajtás dátuma:
                {command.execution_time === null
                  ? "Null"
                  : command.execution_time}{" "}
              </p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Létrehozta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={command.meta.picture || "/placeholder.svg"} />
                <AvatarFallback>command.meta.email</AvatarFallback>
              </Avatar>
              <p className="mt-3 text-sm font-medium text-foreground">
                {command.meta.name}
              </p>
            </CardContent>
          </Card>
          <Device device={command.cmd_device} />
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Paraméterek</CardTitle>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paraméter</TableHead>
                    <TableHead>Értéke</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Típus:{" "}
                    </TableCell>
                    <TableCell> {parameters.type}</TableCell>
                  </TableRow>

                  {command.type === "SET_SCALE" && (
                    <>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Mérési tartomány minimuma:{" "}
                        </TableCell>
                        <TableCell>
                          {parameters.params.lowerThreshold}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Mérési tartomány maximuma:{" "}
                        </TableCell>
                        <TableCell>
                          {parameters.params.upperThreshold}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          A mérési tartomány felbontása:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.resolution}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          A mintavételezés gyakorisága:{" "}
                        </TableCell>
                        <TableCell>
                          {parameters.params.upperThreshold}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  {command.type === "SET_DURATION" && (
                    <>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Ismétlések száma:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.repetitions}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Mód:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.mode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Okaying:{" "}
                        </TableCell>
                        <TableCell>
                          {parameters.params.okaying.toString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Mérési idő:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.duration}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Szünet a mérések között:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.breaktime}</TableCell>
                      </TableRow>
                    </>
                  )}
                  {command.type === "REQUEST_MEASUREMENT" && (
                    <>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          A mérés kivitelezésének időpontja:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.timestamp}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Folytatás betelt csatornával:{" "}
                        </TableCell>
                        <TableCell>
                          {parameters.params.continue_with_full_channel.toString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Header:{" "}
                        </TableCell>
                        <TableCell>
                          {parameters.params.header_packet.toString()}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  {command.type === "REQUEST_SELFTEST" && (
                    <>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          A selftest kiküldésének időpontja:{" "}
                        </TableCell>
                        <TableCell>{parameters.params.timestamp}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
