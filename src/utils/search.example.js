import fs from "fs";
import path from "path";

import { searchBooks, formatBook } from "./search.js";

function loadApiKeyIntoProcessEnv() {
  if (process.env.BOOKS_API_KEY || process.env.VITE_BOOKS_API_KEY) {
    return;
  }

  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envFile = fs.readFileSync(envPath, "utf8");
  const match = envFile.match(/^(?:VITE_)?BOOKS_API_KEY\s*=\s*(.*)$/m);
  if (!match) {
    return;
  }

  process.env.BOOKS_API_KEY = match[1].trim().replace(/^['\"]|['\"]$/g, "");
}

// Placeholder script to demonstrate usage inside Vite app
export async function runSample() {
  loadApiKeyIntoProcessEnv();
  const { items } = await searchBooks("JavaScript");
  return formatBook(items);
}

console.log("Sample search results:", await runSample());
