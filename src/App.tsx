import "./App.css";

import { BusServices } from "@/features/busServices/BusServices";
import { Clock } from "@/features/clock/Clock";
import { Weather } from "@/features/weather/Weather";

function App() {
    return (
        <div className="flex h-full w-full bg-background">
            {/* Left side: Clock only */}
            <div className="w-1/3 flex flex-col items-center justify-center border-r border-border p-8">
                <Clock />
            </div>

            {/* Right side: Weather (1 row at top) + Bus Timings */}
            <div className="w-2/3 flex flex-col overflow-hidden">
                <div className="px-4 pt-4 pb-2 border-b border-border">
                    <Weather />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <BusServices />
                </div>
            </div>
        </div>
    );
}

export default App;
