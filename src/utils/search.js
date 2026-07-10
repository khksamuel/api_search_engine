const GOOGLE_BOOKS_ERROR_PREFIX =
  /^(Rate limit exceeded|Access denied|Google Books API error)/;

function sanitiseApiKey(value) {
  return String(value)
    .trim()
    .replace(/^['\"]|['\"]$/g, "");
}

function readProcessApiKey() {
  if (typeof process === "undefined" || !process.env) {
    return "";
  }

  return process.env.BOOKS_API_KEY || process.env.VITE_BOOKS_API_KEY || "";
}

function formatGoogleBooksApiError(status, message) {
  if (status === 429) {
    return new Error(`Rate limit exceeded (HTTP 429): ${message}`);
  }
  if (status === 403) {
    return new Error(`Access denied (HTTP 403): ${message}`);
  }
  return new Error(`Google Books API error (HTTP ${status}): ${message}`);
}

async function readGoogleBooksApiErrorMessage(response) {
  try {
    const body = await response.json();
    if (!body) return "Unknown API error";
    return body.error?.message || body.error || JSON.stringify(body);
  } catch {
    const text = await response.text().catch(() => "");
    return text || response.statusText || `HTTP ${response.status}`;
  }
}

async function fetchGoogleBooksJson(url, errorContext) {
  try {
    const response = await fetch(url);

    if (response.ok === false) {
      const message = await readGoogleBooksApiErrorMessage(response);
      throw formatGoogleBooksApiError(response.status, message);
    }

    return await response.json().catch(() => ({}));
  } catch (error) {
    if (GOOGLE_BOOKS_ERROR_PREFIX.test(error.message)) {
      throw error;
    }
    throw new Error(`Error fetching ${errorContext}: ${error.message}`);
  }
}

export function getBooksApiKey() {
  const apiKey = readProcessApiKey();
  if (!apiKey) {
    throw new Error(
      "Google Books API key is missing. Set VITE_BOOKS_API_KEY in .env for the app or BOOKS_API_KEY for Node scripts/tests.",
    );
  }

  return sanitiseApiKey(apiKey);
}

export function searchBooks(query) {
  if (!query) throw new Error("Query is required for searching books");
  const apiKey = getBooksApiKey();
  if (!apiKey) throw new Error("BOOKS_API_KEY is missing or empty in .env");
  // hardcoded maxResults=8 to limit the number of results
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=8`;
  return fetchGoogleBooksJson(url, "books").then((data) => data.items || []);
}

export function formatBook(bookdata) {
  if (!bookdata) throw new Error("Error fetching book data");
  return bookdata.map((book) => ({
    title: book.volumeInfo.title,
    id: book.id,
    imageUrl: book.volumeInfo.imageLinks?.thumbnail || null,
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
