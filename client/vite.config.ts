import assert from "node:assert";
import url from "node:url";

import "dotenv/config";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";

assert(process.env["VITE_PROXY"] !== undefined); 
assert(process.env["VITE_BASE"] !== undefined);
assert(process.env["VITE_HASH_ROUTER"] !== undefined);

// https://vitejs.dev/config/
export default defineConfig({
    root: url.fileURLToPath(new URL("src", import.meta.url)),
    publicDir: url.fileURLToPath(new URL("public", import.meta.url)),
    base:process.env["VITE_BASE"],
    build: {
        emptyOutDir: true,
        outDir: url.fileURLToPath(new URL("out", import.meta.url)),
    },
    resolve: {
        alias: {
            "#~": url.fileURLToPath(new URL("src", import.meta.url)),
        },
    },
    esbuild: false,
    plugins: [
        react(),
        typescript(),
    ],
});
