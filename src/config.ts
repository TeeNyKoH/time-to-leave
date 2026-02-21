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
        serviceNo: "72",
        busStopCode: "64489",
        roadName: "Opp Side",
    },
    {
        serviceNo: "109",
        busStopCode: "64489",
        roadName: "Opp Side",
    },
    {
        serviceNo: "159",
        busStopCode: "64489",
        roadName: "Opp Side",
    },
    {
        serviceNo: "116",
        busStopCode: "64481",
        roadName: "My Side",
    },
    {
        serviceNo: "329",
        busStopCode: "64481",
        roadName: "My Side",
    },
    {
        serviceNo: "72",
        busStopCode: "64481",
        roadName: "My Side",
    },
];
