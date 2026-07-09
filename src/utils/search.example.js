import { searchBooks, formatBook } from "./search.js";

// Placeholder script to demonstrate usage inside Vite app
export async function runSample() {
  const books = await searchBooks("JavaScript");
  return formatBook(books);
}
