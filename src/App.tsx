import "./App.css";

import { BusServices } from "@/features/busServices/BusServices";
import { Clock } from "@/features/clock/Clock";

function App() {
    return (
        <div className="flex flex-row h-screen w-full bg-background overflow-hidden">
            {/* Left: My Side 45% */}
            <div className="w-[45vw] flex flex-col border-r border-border">
                <h3 className="text-xl font-semibold text-muted-foreground px-4 py-2 border-b border-border flex-shrink-0">
                    My Side
                </h3>
                <div className="flex-1 overflow-y-auto">
                    <BusServices side="My Side" />
                </div>
            </div>

            {/* Center: Clock 10% */}
            <div className="w-[10vw] flex-shrink-0 flex items-center justify-center border-r border-border">
                <Clock />
            </div>

            {/* Right: Opp Side 45% */}
            <div className="w-[45vw] flex flex-col">
                <h3 className="text-xl font-semibold text-muted-foreground px-4 py-2 border-b border-border flex-shrink-0">
                    Opp Side
                </h3>
                <div className="flex-1 overflow-y-auto">
                    <BusServices side="Opp Side" />
                </div>
            </div>
        </div>
    );
}

export default App;
