import { createHash } from "crypto";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(async ({ mode }) => {
  const fileEnv = loadEnv(mode, __dirname, "");
  const statsPassword = process.env.STATS_PASSWORD || fileEnv.STATS_PASSWORD || "";
  const statsPasswordHash = statsPassword
    ? createHash("sha256").update(statsPassword).digest("hex")
    : "";

  return {
  base: process.env.VITE_BASE_URL || '/',
  define: {
    "import.meta.env.VITE_STATS_PASSWORD_HASH": JSON.stringify(statsPasswordHash),
  },
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
};
});
