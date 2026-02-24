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
            hour12: false,
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
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center">
                <span className="scroll-m-20 text-8xl font-bold tracking-tight mb-3">
                    {formatTime(time)}
                </span>
                <p className="text-xl text-muted-foreground">
                    {formatDate(time)}
                </p>
            </div>
        </div>
    );
}
