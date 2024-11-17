import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths({root: './'}),
        react()
    ],
    resolve: {
        alias: {
            "@ParkComponents/*": path.resolve(__dirname, "./src/library/components"),
            "@Components/*": path.resolve(__dirname, "./src/components"),
            "@Pages/*": path.resolve(__dirname, "./src/pages"),
            "@Utils/*": path.resolve(__dirname, "./src/utils"),
        }
    }
})
