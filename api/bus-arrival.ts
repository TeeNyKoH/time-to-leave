import type { VercelRequest, VercelResponse } from "@vercel/node";

const LTA_API_KEY = process.env.LTA_API_KEY;
const LTA_API_BASE_URL = "https://datamall2.mytransport.sg/ltaodataservice/v3";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Validate API key is configured
    if (!LTA_API_KEY) {
        return res.status(500).json({
            error: "LTA_API_KEY environment variable is not configured",
        });
    }

    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { BusStopCode, ServiceNo } = req.query;

    if (!BusStopCode || !ServiceNo) {
        return res.status(400).json({
            error: "Missing required parameters: BusStopCode and ServiceNo",
        });
    }

    try {
        const response = await fetch(
            `${LTA_API_BASE_URL}/BusArrival?BusStopCode=${BusStopCode}&ServiceNo=${ServiceNo}`,
            {
                headers: {
                    AccountKey: LTA_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`LTA API returned ${response.status}`);
        }

        const data = await response.json();

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching bus arrival data:", error);
        return res.status(500).json({
            error: "Failed to fetch bus arrival data",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
