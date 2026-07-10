import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const booksApiKey = env.VITE_BOOKS_API_KEY || env.BOOKS_API_KEY || "";

  return {
    plugins: [react()],
    define: {
      "process.env": {
        BOOKS_API_KEY: booksApiKey,
        VITE_BOOKS_API_KEY: booksApiKey,
      },
    },
  };
});
