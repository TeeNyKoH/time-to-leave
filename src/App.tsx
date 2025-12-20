import "./App.css";

import { BusServices } from "@/features/busServices/BusServices";
import { Clock } from "@/features/clock/Clock";
import { Weather } from "@/features/weather/Weather";

function App() {
    return (
        <div className="flex h-full w-full bg-background">
            {/* Left side: Clock & Weather */}
            <div className="flex-1 flex flex-col items-center justify-center border-r border-border p-8">
                <div className="flex flex-col items-center gap-4">
                    <Clock />
                    <Weather />
                </div>
            </div>

            {/* Right side: Bus Timings */}
            <div className="flex-1 flex items-start justify-center px-4 py-2 overflow-y-auto">
                <BusServices />
            </div>
        </div>
    );
}

export default App;
