import * as React from "react";
import { useState, useEffect } from "react";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { LTA_API_BASE_URL, BUS_SERVICES, type BusService } from "@/config";

type BusData = {
    service: string;
    busStopCode: string;
    estimatedArrival: Date;
    load: string;
    type: string;
    minutesAway: number;
    roadName: string;
};

export function BusServices() {
    const [buses, setBuses] = useState<BusData[]>([]);

    const getBusTime = async (busServices: BusService[]) => {
        const fetchPromises = busServices.map(
            async ({ serviceNo, busStopCode, roadName }) => {
                try {
                    // API call through Vercel serverless function proxy
                    const res = await fetch(
                        `${LTA_API_BASE_URL}?BusStopCode=${busStopCode}&ServiceNo=${serviceNo}`
                    );

                    if (!res.ok) {
                        console.error(
                            `API error for bus ${serviceNo}:`,
                            res.status
                        );
                        return [];
                    }

                    const data = await res.json();

                    // Check if the response has the expected structure
                    if (!data.Services || !data.Services[0]) {
                        console.error(`No service data for bus ${serviceNo}`);
                        return [];
                    }

                    return [
                        data.Services[0].NextBus,
                        data.Services[0].NextBus2,
                        data.Services[0].NextBus3,
                    ]
                        .filter((bus) => bus && bus.EstimatedArrival)
                        .map(
                            (bus: {
                                Load: string;
                                Type: string;
                                EstimatedArrival: string;
                            }) => {
                                const arrivalTime = new Date(
                                    bus.EstimatedArrival
                                ).getTime();
                                const now = Date.now();
                                const minutesAway = Math.max(
                                    0,
                                    Math.round((arrivalTime - now) / 60000)
                                );
                                return {
                                    service: serviceNo,
                                    busStopCode: busStopCode,
                                    roadName: roadName,
                                    estimatedArrival: new Date(
                                        bus.EstimatedArrival
                                    ),
                                    load: bus.Load,
                                    type: bus.Type,
                                    minutesAway: minutesAway,
                                };
                            }
                        );
                } catch (error) {
                    console.error(`Error fetching bus ${serviceNo}:`, error);
                    return [];
                }
            }
        );

        const results = await Promise.all(fetchPromises);
        setBuses(
            results
                .flat()
                .sort(
                    (a, b) =>
                        a.estimatedArrival.getTime() -
                        b.estimatedArrival.getTime()
                )
        );

        return;
    };

    useEffect(() => {
        getBusTime(BUS_SERVICES);

        // Refresh bus data every 30 seconds
        const interval = setInterval(() => {
            getBusTime(BUS_SERVICES);
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex w-full flex-col gap-2">
            <ItemGroup>
                {buses.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                        No buses in operation
                    </p>
                ) : (
                    buses.map((bus, index) => (
                        <React.Fragment
                            key={
                                bus.service +
                                bus.busStopCode +
                                bus.estimatedArrival.getTime()
                            }
                        >
                            <Item>
                                <ItemMedia className="w-20 justify-start flex-col items-center gap-0.5">
                                    <h2 className="scroll-m-20 text-5xl font-semibold tracking-tight leading-tight first:mt-0">
                                        {bus.service}
                                    </h2>
                                    <span className="text-xs text-muted-foreground leading-none">
                                        {bus.type === "SD"
                                            ? "single"
                                            : bus.type === "DD"
                                            ? "double"
                                            : bus.type === "BD"
                                            ? "bendy"
                                            : ""}
                                    </span>
                                </ItemMedia>
                                <ItemContent className="gap-1">
                                    <ItemTitle className="text-2xl font-semibold">
                                        {bus.minutesAway <= 1
                                            ? "Arriving"
                                            : `${bus.minutesAway} min`}
                                    </ItemTitle>
                                    <ItemDescription className="text-left text-base">
                                        {bus.roadName}
                                    </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            bus.load === "SEA"
                                                ? "bg-green-500"
                                                : bus.load === "SDA"
                                                ? "bg-amber-500"
                                                : bus.load === "LSD"
                                                ? "bg-red-500"
                                                : "bg-gray-500"
                                        }`}
                                        title={bus.load}
                                    />
                                </ItemActions>
                            </Item>
                            {index !== buses.length - 1 && <ItemSeparator />}
                        </React.Fragment>
                    ))
                )}
            </ItemGroup>
        </div>
    );
}
