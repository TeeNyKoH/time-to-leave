import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            proxy: {
                "/api/bus-arrival": {
                    target: "https://datamall2.mytransport.sg",
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => {
                        const url = new URL(path, "http://localhost:5173");
                        return `/ltaodataservice/v3/BusArrival${url.search}`;
                    },
                    configure: (proxy, _options) => {
                        proxy.on("proxyReq", (proxyReq, _req, _res) => {
                            proxyReq.setHeader(
                                "AccountKey",
                                env.LTA_API_KEY || ""
                            );
                        });
                    },
                },
                "/api/weather": {
                    target: "https://api.weatherapi.com",
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => {
                        const url = new URL(path, "http://localhost:5173");
                        const location =
                            url.searchParams.get("location") || "Singapore";
                        return `/v1/forecast.json?key=${env.WEATHER_API_KEY}&q=${location}&days=1&aqi=no&alerts=no`;
                    },
                },
            },
        },
    };
});
