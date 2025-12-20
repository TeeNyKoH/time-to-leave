import { useState, useEffect } from "react";
import { WEATHER_API_BASE_URL } from "@/config";

type WeatherData = {
    location: {
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
            icon: string;
        };
        humidity: number;
        feelslike_c: number;
    };
    forecast: {
        forecastday: Array<{
            date: string;
            hour: Array<{
                time: string;
                time_epoch: number;
                temp_c: number;
                condition: {
                    text: string;
                    icon: string;
                };
                chance_of_rain: number;
            }>;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                condition: {
                    text: string;
                    icon: string;
                };
            };
        }>;
    };
};

const LOCATION = "Singapore";

export function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // API call through Vercel serverless function proxy
                const response = await fetch(
                    `${WEATHER_API_BASE_URL}?location=${LOCATION}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const data = await response.json();
                setWeather(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                setLoading(false);
            }
        };

        fetchWeather();
        // Refresh weather every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="text-center text-muted-foreground">
                Loading weather...
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="text-center text-muted-foreground">
                Weather unavailable
            </div>
        );
    }

    const today = weather.forecast.forecastday[0];

    // Get hourly forecasts for specific time periods:
    // Morning: 0700-1000 (7, 8, 9, 10)
    // Evening: 1700-2000 (17, 18, 19, 20)
    const morningHours = [7, 8, 9, 10];
    const eveningHours = [17, 18, 19, 20];
    const targetHours = [...morningHours, ...eveningHours];

    // Filter and get hourly data for the specified time periods
    const hourlyForecasts = today.hour.filter((h) => {
        const hourTime = new Date(h.time_epoch * 1000);
        return targetHours.includes(hourTime.getHours());
    });

    return (
        <div className="flex flex-col items-center gap-4 mt-4 max-w-full">
            {/* Hourly Forecast for 0700-1000 and 1700-2000 */}
            {hourlyForecasts.length > 0 && (
                <div className="w-full max-w-full overflow-x-auto">
                    <div className="grid grid-cols-4 gap-3 min-w-0">
                        {hourlyForecasts.map((hour) => {
                            const time = new Date(hour.time_epoch * 1000);
                            const hourStr = time.toLocaleTimeString("en-SG", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            });

                            return (
                                <div
                                    key={hour.time}
                                    className="flex flex-col items-center gap-2 bg-muted/30 rounded-lg p-3"
                                >
                                    <div className="text-base text-muted-foreground">
                                        {hourStr}
                                    </div>
                                    <img
                                        src={`https:${hour.condition.icon}`}
                                        alt={hour.condition.text}
                                        className="w-12 h-12"
                                    />
                                    <div className="text-xl font-medium">
                                        {Math.round(hour.temp_c)}°
                                    </div>
                                    <div className="text-base text-blue-400">
                                        {hour.chance_of_rain}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
