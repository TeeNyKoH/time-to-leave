import "./App.css";

import { BusServices } from "@/features/busServices/BusServices";
import { Clock } from "@/features/clock/Clock";
import { Weather } from "@/features/weather/Weather";

function App() {
    return (
        <div className="flex flex-col h-screen w-full bg-background">
            {/* Top 25%: Clock + Weather */}
            <div className="h-1/4 flex-shrink-0 flex items-center gap-6 px-6 border-b border-border">
                <Clock />
                <div className="flex-1">
                    <Weather />
                </div>
            </div>

            {/* Bottom 75%: My Side | Opp Side */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: My Side */}
                <div className="flex-1 flex flex-col border-r border-border overflow-y-auto">
                    <h3 className="text-sm font-semibold text-muted-foreground px-4 py-2 border-b border-border">
                        My Side
                    </h3>
                    <BusServices side="My Side" />
                </div>

                {/* Right: Opp Side */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <h3 className="text-sm font-semibold text-muted-foreground px-4 py-2 border-b border-border">
                        Opp Side
                    </h3>
                    <BusServices side="Opp Side" />
                </div>
            </div>
        </div>
    );
}

export default App;
