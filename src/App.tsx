import "./App.css";

import { BusServices } from "@/features/busServices/BusServices";
import { Clock } from "@/features/clock/Clock";
import { Weather } from "@/features/weather/Weather";

function App() {
    return (
        <div className="flex flex-col h-full w-full bg-background">
            {/* Top: Clock + Weather side by side */}
            <div className="flex items-center gap-6 px-6 py-4 border-b border-border">
                <Clock />
                <div className="flex-1">
                    <Weather />
                </div>
            </div>

            {/* Bottom: Bus Timings */}
            <div className="flex-1 overflow-y-auto">
                <BusServices />
            </div>
        </div>
    );
}

export default App;
