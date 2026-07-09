import fs from "fs";
import path from "path";

export function getBooksApiKey() {
  // Prefer an explicit environment variable when available (useful for tests and CI)
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.BOOKS_API_KEY
  ) {
    return String(process.env.BOOKS_API_KEY)
      .trim()
      .replace(/^['\\"]|['\\"]$/g, "");
  }

  const cwdFallback =
    typeof process !== "undefined" && typeof process.cwd === "function"
      ? process.cwd()
      : path.resolve(".");
  const envPath = path.resolve(cwdFallback, ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error(
      ".env file not found, please create one with your BOOKS_API_KEY following the instructions in the README",
    );
  }

  const envFile = fs.readFileSync(envPath, "utf8");
  if (!envFile) {
    throw new Error(
      ".env file is empty, please follow template in .env.example",
    );
  }

  const match = envFile.match(/^BOOKS_API_KEY\s*=\s*(.*)$/m);
  if (!match) {
    throw new Error("BOOKS_API_KEY was not found in .env");
  }

  return match[1].trim().replace(/^[\\"]|[\\"]$/g, "");
}

export function searchBooks(query) {
  if (!query) throw new Error("Query is required for searching books");
  const apiKey = getBooksApiKey();
  if (!apiKey) throw new Error("BOOKS_API_KEY is missing or empty in .env");
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
  return fetch(url)
    .then(async (response) => {
      if (response.ok === false) {
        let body;
        try {
          body = await response.json();
        } catch {
          const text = await response.text().catch(() => "");
          const msg = text || response.statusText || `HTTP ${response.status}`;
          if (response.status === 429)
            throw new Error(`Rate limit exceeded (HTTP 429): ${msg}`);
          if (response.status === 403)
            throw new Error(`Access denied (HTTP 403): ${msg}`);
          throw new Error(
            `Google Books API error (HTTP ${response.status}): ${msg}`,
          );
        }

        const apiMessage =
          (body && (body.error?.message || body.error)) || JSON.stringify(body);
        if (response.status === 429)
          throw new Error(`Rate limit exceeded (HTTP 429): ${apiMessage}`);
        if (response.status === 403)
          throw new Error(`Access denied (HTTP 403): ${apiMessage}`);
        throw new Error(
          `Google Books API error (HTTP ${response.status}): ${apiMessage}`,
        );
      }

      const data = await response.json().catch(() => ({}));
      return data.items || [];
    })
    .catch((error) => {
      if (
        /^(Rate limit exceeded|Access denied|Google Books API error)/.test(
          error.message,
        )
      ) {
        throw error;
      }
      throw new Error(`Error fetching books: ${error.message}`);
    });
}

export function formatBook(bookdata) {
  if (!bookdata) throw new Error("Error fetching book data");
  return bookdata.map((book) => ({
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors,
    publisher: book.volumeInfo.publisher,
    publishedDate: book.volumeInfo.publishedDate,
    description: book.volumeInfo.description,
    pageCount: book.volumeInfo.pageCount,
    categories: book.volumeInfo.categories,
    averageRating: book.volumeInfo.averageRating,
    ratingsCount: book.volumeInfo.ratingsCount,
    language: book.volumeInfo.language,
    previewLink: book.volumeInfo.previewLink,
  }));
}

export function getColumnNamesFromBooks(bookdata) {
  const formattedBooks = formatBook(bookdata);
  if (!formattedBooks.length) return [];
  return Object.keys(formattedBooks[0]);
}
