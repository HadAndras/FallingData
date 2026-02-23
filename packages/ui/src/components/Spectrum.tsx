import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis} from "recharts"
import {type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent} from "@workspace/ui/components/chart"


type energyCountPair = {
    energy: number,
    count: number,
}

type Input = {
    packets: string[],
    min_threshold: number,
    max_threshold: number,
    resolution:number
}

export default function SpectrumCard({ data }: { data: Input }) {
    const size: number = 4;
    let channelList: string[] = [];
    let countArr: number[] = [];
    let chartData: energyCountPair[] = []
    //Paketek szétválasztása
    for(const p of data.packets){
        for (let i = 0; i < p.length; i += size) {
            channelList.push(p.slice(i, i + size));
        }
    }

    //Egyes countok meghatározása
    let sum = 0;
    for(const c in channelList){
        for (let j = 0; j < c.length; j++) {
            if(Number(c[j])-Number("0") >= 10){
                sum += Number(c[j])-Number("A")+10
            }
            else {
                sum += Number(c[j]) - Number("0")
            }
        }
        countArr.push(sum);
        sum = 0;
    }
    //Energiák meghatározása

    for(let c = 0; c < countArr.length; c++){
        chartData.push({count: countArr[c] ?? -100,
        energy: data.min_threshold+c*Math.round(data.max_threshold-data.min_threshold)/data.resolution});
    }

    const chartConfig = {
        count: {
            label: "Count",
            color: "#2563eb",
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="energy"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}