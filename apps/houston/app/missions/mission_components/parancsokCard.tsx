import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/src/components/card.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/src/components/table.tsx";
import { ExternalLink } from "lucide-react"

export interface ParancsItem {
    id: number
    type: string
    command: string
}

export function ParancsokCard({ data }: { data: ParancsItem[] | null }) {
    if(data == null){
        return (
            <Card className="h-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Parancsok</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Nem tartoznak parancsok a küldetéshez</p>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Parancsok</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border">
                            <TableHead className="h-8 px-2 text-xs text-foreground font-semibold">ID</TableHead>
                            <TableHead className="h-8 px-2 text-xs text-foreground font-semibold">Típus</TableHead>
                            <TableHead className="h-8 px-2 text-xs text-foreground font-semibold">Parancs</TableHead>
                            <TableHead className="h-8 w-8 px-2" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={`${item.id}-${index}`} className="border-0">
                                <TableCell className="px-2 py-1.5 text-sm text-foreground">{item.id}</TableCell>
                                <TableCell className="px-2 py-1.5 text-sm text-foreground">{item.type}</TableCell>
                                <TableCell className="px-2 py-1.5 text-sm font-mono text-foreground">{item.command}</TableCell>
                                <TableCell className="px-2 py-1.5">
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
