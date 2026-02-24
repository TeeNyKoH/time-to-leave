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
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="text-xs text-muted-foreground">
                Loading weather...
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="text-xs text-muted-foreground">
                Weather unavailable
            </div>
        );
    }

    const today = weather.forecast.forecastday[0];

    // Get the next 4 upcoming hours from current time
    const currentHour = new Date().getHours();
    const upcomingForecasts = today.hour
        .filter((h) => {
            const hour = new Date(h.time_epoch * 1000).getHours();
            return hour >= currentHour;
        })
        .slice(0, 4);

    return (
        <div className="grid grid-cols-4 gap-2 w-full">
            {upcomingForecasts.map((hour) => {
                const time = new Date(hour.time_epoch * 1000);
                const hourStr = time.toLocaleTimeString("en-SG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

                return (
                    <div
                        key={hour.time}
                        className="flex flex-col items-center gap-1 bg-muted/30 rounded-lg p-2"
                    >
                        <div className="text-xs text-muted-foreground">
                            {hourStr}
                        </div>
                        <img
                            src={`https:${hour.condition.icon}`}
                            alt={hour.condition.text}
                            className="w-8 h-8"
                        />
                        <div className="text-sm font-medium">
                            {Math.round(hour.temp_c)}°
                        </div>
                        <div className="text-xs text-blue-400">
                            {hour.chance_of_rain}%
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
