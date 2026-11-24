import { createHash } from "crypto";
import fs from "fs";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, __dirname, "");
  const statsPassword = process.env.STATS_PASSWORD || fileEnv.STATS_PASSWORD || "";
  const statsPasswordHash = statsPassword
    ? createHash("sha256").update(statsPassword).digest("hex")
    : "";

  return {
    base: process.env.VITE_BASE_URL || "/",
    define: {
      "import.meta.env.VITE_STATS_PASSWORD_HASH": JSON.stringify(statsPasswordHash),
    },
    plugins: [
      react(),
      {
        name: "github-pages-routes",
        apply: "build",
        closeBundle() {
          const outDir = path.resolve(__dirname, "dist");
          const indexPath = path.join(outDir, "index.html");
          if (!fs.existsSync(indexPath)) return;
          const html = fs.readFileSync(indexPath);
          fs.writeFileSync(path.join(outDir, "404.html"), html);
          fs.mkdirSync(path.join(outDir, "stats"), { recursive: true });
          fs.writeFileSync(path.join(outDir, "stats", "index.html"), html);
          fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
  };
});
