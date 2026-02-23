import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/src/components/card.tsx";
import { Button } from "@workspace/ui/src/components/button.tsx";
import { ExternalLink, PlusCircle } from "lucide-react"

interface AlapadatokData {
    nev: string
    status: string
    letrehozo: string
    exec_time?: string
}

export function AlapadatokCard({ data }: { data: AlapadatokData }) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Alapadatok</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{data.nev}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-foreground" />
                    <span className="text-sm font-medium text-foreground">{data.status}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-foreground">{data.letrehozo}</span>
                </div>

                <p className="text-sm text-muted-foreground">
                    {data.exec_time || "Végrehajtási időpont megadása"}
                </p>

                <div className="flex items-center gap-3 pt-2">
                    <Button variant="outline" size="sm">
                        Ütemezés
                    </Button>
                    <Button variant="destructive" size="sm" className="rounded-full">
                        Megszakítás
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}