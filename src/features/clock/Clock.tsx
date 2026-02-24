import { useState, useEffect } from "react";

export function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-SG", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-SG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 py-6">
            <span
                className="text-4xl font-bold tracking-tight tabular-nums"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
                {formatTime(time)}
            </span>
            <div className="w-px h-8 bg-border flex-shrink-0" />
            <span
                className="text-xs text-muted-foreground text-center"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
                {formatDate(time)}
            </span>
        </div>
    );
}
