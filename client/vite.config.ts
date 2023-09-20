import url from "node:url";

import "dotenv/config";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    root: url.fileURLToPath(new URL("src", import.meta.url)),
    publicDir: url.fileURLToPath(new URL("public", import.meta.url)),
    build: {
        emptyOutDir: true,
        outDir: url.fileURLToPath(new URL("out", import.meta.url)),
    },
    resolve: {
        alias: {
            "#~": url.fileURLToPath(new URL("src", import.meta.url)),
        },
    },
    plugins: [react()],
});
