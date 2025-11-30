import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/travel-app/",
  resolve: {
    alias: [
      // "@/..." -> "<root>/src/..."
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },

      // "pkg@1.2.3" or "@scope/pkg@1.2.3" -> "pkg" or "@scope/pkg"
      { find: /^((?:@[^/]+\/)?[^@/]+)@\d+\.\d+\.\d+(\/.*)?$/, replacement: "$1$2" },
    ],
  },
  build: {
    target: "esnext",
    outDir: "build",
  },
  server: {
    port: 8080,
    open: true,
  },
});
