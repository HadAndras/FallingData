import { createClient } from "@/lib/supabase/server.ts";
import { AlapadatokCard } from "@/app/missions/mission_components/AlapAdatokCard.tsx";
import { BeallitasokCard } from "@/app/missions/mission_components/BeallitasokCard.tsx";
import { ParancsokCard, type ParancsItem } from "@/app/missions/mission_components/parancsokCard.tsx";
import { PacketekCard, type PacketItem } from "@/app/missions/mission_components/packetek-card.tsx";
import { parse_packet, formatPacketDetailTable } from "@workspace/device-comm/src/packet_parser.ts";
import { MetaadatokCard } from "@/app/missions/mission_components/metaadatok-card.tsx";
import Device from "@/components/device";
import SpectrumCard from "@workspace/ui/src/components/Spectrum.tsx";

export default async function missionDataPage({params,}: {
    params: Promise<{ mission_id: string }>;
}) {

    const { mission_id } = await params;
    const supabase = await createClient();

    const { data: viewData } = await supabase
        .from("missions_table")
        .select("*")
        .eq("id", mission_id)
        .single();

    const { data: details } = await supabase
        .from("missions")
        .select("*")
        .eq("id", mission_id)
        .single();

    const { data: settings } = await supabase
        .from("mission_settings")
        .select("*")
        .eq("id", mission_id)
        .single();

    const { data: commands } = await supabase
        .from("commands")
        .select('id, type, command')
        .eq("mission_id", mission_id) as { data: ParancsItem[] | null };

    const { data: packets } = await supabase
        .from("packets")
        .select('id, type, packet')
        .eq("mission_id", mission_id) as { data: PacketItem[] | null };

    const {data: spectrumPackets} = await supabase
        .from("packets")
        .select('id, type, packet')
        .eq("mission_id", mission_id)
        .eq("type", "SPECTRUM") as { data: PacketItem[] | null };

    const { data: headerPacket } = await supabase
        .from("packets")
        .select('id, type, packet, details')
        .eq("mission_id", mission_id)
        .eq("type", "HEADER")
        .single();


    const { packet_type, data } = parse_packet(
        headerPacket?.packet ?? "00000000000000000000000000000000"
    );

    const headerData = formatPacketDetailTable(packet_type, data ?? undefined);

    const alapAdatok = {
        nev: viewData?.name,
        status: viewData?.status,
        letrehozo: viewData?.meta?.name,
        exec_time: viewData?.exec_time
    };

    const beallitasok = [
        { nev: "Típus", ertek: settings?.type },
        { nev: "Mérési tart. minimum  (mV)", ertek: settings?.min_voltage },
        { nev: "Mérési tart. maximum (mV)", ertek: settings?.max_voltage },
        { nev: "Sampling", ertek: settings?.samples },
        { nev: "Felbontás (csatorna)", ertek: settings?.resolution },
        { nev: "Időtartam (beütés)", ertek: settings?.duration },
        { nev: "Okézás", ertek: settings?.is_okay },
        { nev: "Fejléc packet", ertek: settings?.is_header },
        { nev: "Folytat ha megtelik?", ertek: settings?.continue_with_full_channel },
    ];

    const spectrum: string[] = (spectrumPackets || []).map((p) => p.packet);

    return (
        <main className="min-h-screen bg-background p-6 lg:p-10">
            {/* Page title */}
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Küldetés adatai
            </h1>

            {/* Top row: Alapadatok */}
            <div className="mb-6">
                <AlapadatokCard data={alapAdatok} />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Device device={details?.device} />
                <BeallitasokCard data={beallitasok} />
                <ParancsokCard data={commands} />
            </div>

            {/* Bottom row: Packetek, Metaadatok, Spektrum */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <PacketekCard data={packets} />
                <MetaadatokCard data={headerData} />
                <SpectrumCard
                    data={{
                        packets: spectrum,
                        min_threshold: settings?.min_voltage,
                        max_threshold: settings?.max_voltage,
                        resolution: settings?.resolution
                    }}
                />
            </div>
        </main>
    );
}