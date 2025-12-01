import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  base: "/foundation-project/",
  resolve: {
    alias: [
      // "@/..." -> "<root>/src/..."
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },

      // "pkg@1.2.3" or "@scope/pkg@1.2.3" -> "pkg" or "@scope/pkg"
      {
        find: /^((?:@[^/]+\/)?[^@/]+)@\d+\.\d+\.\d+(\/.*)?$/,
        replacement: "$1$2",
      },
    ],
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
}));
