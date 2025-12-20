import type { VercelRequest, VercelResponse } from "@vercel/node";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Validate API key is configured
    if (!WEATHER_API_KEY) {
        return res.status(500).json({
            error: "WEATHER_API_KEY environment variable is not configured",
        });
    }

    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { location = "Singapore" } = req.query;

    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=1&aqi=no&alerts=no`
        );

        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}`);
        }

        const data = await response.json();

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return res.status(500).json({
            error: "Failed to fetch weather data",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
