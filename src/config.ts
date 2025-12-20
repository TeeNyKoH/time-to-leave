// Configuration for API endpoints
// Use Vercel serverless functions as proxy to avoid CORS issues
export const LTA_API_BASE_URL = "/api/bus-arrival";
export const WEATHER_API_BASE_URL = "/api/weather";

// Bus services configuration
export type BusService = {
    serviceNo: string;
    busStopCode: string;
    roadName: string;
};

export const BUS_SERVICES: BusService[] = [
    {
        serviceNo: "43",
        busStopCode: "66499",
        roadName: "Blk 911, Buangkok Green",
    },
    {
        serviceNo: "156",
        busStopCode: "66499",
        roadName: "Blk 911, Buangkok Green",
    },
    {
        serviceNo: "109",
        busStopCode: "64619",
        roadName: "Opp Blk 913, Hougang Ave 4",
    },
];
