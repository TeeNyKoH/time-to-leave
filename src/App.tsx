import "./App.css";

import { BusServices } from "@/features/busServices/BusServices";
import { Clock } from "@/features/clock/Clock";

function App() {
    return (
        <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
            {/* My Side - top 45% */}
            <div className="h-[45vh] flex flex-col border-b border-border">
                <h3 className="text-xl font-semibold text-muted-foreground px-4 py-2 border-b border-border flex-shrink-0">
                    My Side
                </h3>
                <div className="flex-1 overflow-y-auto">
                    <BusServices side="My Side" />
                </div>
            </div>

            {/* Clock - middle 10% */}
            <div className="h-[10vh] flex-shrink-0 flex items-center justify-center border-b border-border">
                <Clock />
            </div>

            {/* Opp Side - bottom 45% */}
            <div className="h-[45vh] flex flex-col">
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
