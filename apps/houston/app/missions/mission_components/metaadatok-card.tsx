import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/src/components/card.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/src/components/table.tsx";


export function MetaadatokCard({ data }: { data: string[][] }) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Metaadatok</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border">
                            <TableHead className="h-8 px-2 text-xs text-foreground font-semibold">Adat</TableHead>
                            <TableHead className="h-8 px-2 text-xs text-foreground font-semibold text-right">Értéke</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item[0]} className="border-0">
                                <TableCell className="px-2 py-1.5 text-sm text-muted-foreground">
                                    {item[0]}
                                </TableCell>
                                <TableCell className="px-2 py-1.5 text-sm text-right text-foreground">
                                    {item[1]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
