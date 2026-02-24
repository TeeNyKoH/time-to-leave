import { useState, useEffect } from "react";
import { LTA_API_BASE_URL, BUS_SERVICES, type BusService } from "@/config";

type BusTiming = {
    estimatedArrival: Date;
    load: string;
    type: string;
    minutesAway: number;
    isTracked: boolean;
};

type BusServiceGroup = {
    serviceNo: string;
    busStopCode: string;
    roadName: string;
    timings: BusTiming[];
};

function BusTypeBadge({ type }: { type: string }) {
    if (type === "DD") {
        return (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">
                Double
            </span>
        );
    }
    if (type === "BD") {
        return (
            <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-medium">
                Bendy
            </span>
        );
    }
    return (
        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
            Single
        </span>
    );
}

function CrowdBadge({ load }: { load: string }) {
    if (load === "SEA") {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Seats avail</span>
            </div>
        );
    }
    if (load === "SDA") {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Standing</span>
            </div>
        );
    }
    if (load === "LSD") {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Crowded</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">—</span>
        </div>
    );
}

export function BusServices() {
    const [groups, setGroups] = useState<BusServiceGroup[]>([]);

    const getBusTime = async (busServices: BusService[]) => {
        const fetchPromises = busServices.map(
            async ({ serviceNo, busStopCode, roadName }) => {
                try {
                    const res = await fetch(
                        `${LTA_API_BASE_URL}?BusStopCode=${busStopCode}&ServiceNo=${serviceNo}`
                    );

                    if (!res.ok) {
                        console.error(
                            `API error for bus ${serviceNo}:`,
                            res.status
                        );
                        return null;
                    }

                    const data = await res.json();

                    if (!data.Services || !data.Services[0]) {
                        return null;
                    }

                    const svc = data.Services[0];
                    const timings: BusTiming[] = [
                        svc.NextBus,
                        svc.NextBus2,
                        svc.NextBus3,
                    ]
                        .filter((b) => b && b.EstimatedArrival)
                        .map(
                            (b: {
                                EstimatedArrival: string;
                                Load: string;
                                Type: string;
                                Latitude: string;
                                Longitude: string;
                            }) => {
                                const arrivalTime = new Date(
                                    b.EstimatedArrival
                                ).getTime();
                                const now = Date.now();
                                return {
                                    estimatedArrival: new Date(
                                        b.EstimatedArrival
                                    ),
                                    load: b.Load,
                                    type: b.Type,
                                    minutesAway: Math.max(
                                        0,
                                        Math.round((arrivalTime - now) / 60000)
                                    ),
                                    isTracked:
                                        parseFloat(b.Latitude) !== 0 ||
                                        parseFloat(b.Longitude) !== 0,
                                };
                            }
                        );

                    return { serviceNo, busStopCode, roadName, timings };
                } catch (error) {
                    console.error(`Error fetching bus ${serviceNo}:`, error);
                    return null;
                }
            }
        );

        const results = await Promise.all(fetchPromises);
        setGroups(
            results.filter(
                (r): r is BusServiceGroup =>
                    r !== null && r.timings.length > 0
            )
        );
    };

    useEffect(() => {
        getBusTime(BUS_SERVICES);
        const interval = setInterval(() => getBusTime(BUS_SERVICES), 20000);
        return () => clearInterval(interval);
    }, []);

    if (groups.length === 0) {
        return (
            <div className="flex w-full items-center justify-center py-8">
                <p className="text-muted-foreground text-sm text-center">
                    No buses in operation
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col divide-y divide-border">
            {groups.map((group) => (
                <div
                    key={group.serviceNo + group.busStopCode}
                    className="flex items-start gap-4 py-4 px-4"
                >
                    {/* Bus number + stop label */}
                    <div className="w-16 flex-shrink-0 flex flex-col items-center pt-1">
                        <h2 className="text-4xl font-bold leading-none">
                            {group.serviceNo}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                            {group.roadName}
                        </p>
                    </div>

                    {/* Up to 3 timing chips */}
                    <div className="flex gap-3 flex-wrap">
                        {group.timings.map((t, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-1.5 bg-muted/30 rounded-xl px-3 py-2.5 min-w-[100px]"
                            >
                                {/* Arrival time */}
                                <span className="text-xl font-semibold leading-none">
                                    {t.minutesAway <= 1
                                        ? "Arriving"
                                        : `${t.minutesAway} min`}
                                </span>

                                {/* Bus type + Live tracking */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <BusTypeBadge type={t.type} />
                                    {t.isTracked ? (
                                        <span className="text-xs text-green-400 font-medium">
                                            Live
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            Sched
                                        </span>
                                    )}
                                </div>

                                {/* Crowd status */}
                                <CrowdBadge load={t.load} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
