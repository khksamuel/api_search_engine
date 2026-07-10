import {
  getBooksApiKey,
  searchBooks,
  formatBook,
  getColumnNamesFromBooks,
} from "../src/utils/search.js";

const EXPECTED_COLUMNS = [
  "title",
  "id",
  "imageUrl",
  "authors",
  "publisher",
  "publishedDate",
  "description",
  "pageCount",
  "categories",
  "averageRating",
  "ratingsCount",
  "language",
  "previewLink",
];

function createBook(overrides = {}) {
  return {
    volumeInfo: {
      title: "JavaScript: The Good Parts",
      authors: ["Douglas Crockford"],
      publisher: "O'Reilly",
      publishedDate: "2008-05-01",
      description: "A deep dive into JavaScript.",
      pageCount: 176,
      categories: ["Programming"],
      averageRating: 4.5,
      ratingsCount: 1200,
      language: "en",
      previewLink: "https://example.com/preview",
      ...overrides,
    },
  };
}

let originalFetch;
let originalBooksApiKey;
let originalViteBooksApiKey;

describe("Google Books helpers", () => {
  beforeEach(() => {
    originalFetch = global.fetch;
    originalBooksApiKey = process.env.BOOKS_API_KEY;
    originalViteBooksApiKey = process.env.VITE_BOOKS_API_KEY;
    delete process.env.BOOKS_API_KEY;
    delete process.env.VITE_BOOKS_API_KEY;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalBooksApiKey === undefined) {
      delete process.env.BOOKS_API_KEY;
    } else {
      process.env.BOOKS_API_KEY = originalBooksApiKey;
    }

    if (originalViteBooksApiKey === undefined) {
      delete process.env.VITE_BOOKS_API_KEY;
    } else {
      process.env.VITE_BOOKS_API_KEY = originalViteBooksApiKey;
    }
  });

  test("getBooksApiKey reads BOOKS_API_KEY from process.env", () => {
    process.env.BOOKS_API_KEY = "test-key-123";

    expect(getBooksApiKey()).toBe("test-key-123");
  });

  test("getBooksApiKey falls back to VITE_BOOKS_API_KEY", () => {
    process.env.VITE_BOOKS_API_KEY = "vite-key-456";

    expect(getBooksApiKey()).toBe("vite-key-456");
  });

  test("getBooksApiKey strips wrapping quotes", () => {
    process.env.BOOKS_API_KEY = '"quoted-key"';

    expect(getBooksApiKey()).toBe("quoted-key");
  });

  test("getBooksApiKey throws if API key is missing", () => {

    expect(() => getBooksApiKey()).toThrow(
      /Google Books API key is missing/,
    );
  });

  test("searchBooks throws if BOOKS_API_KEY is missing", () => {
    expect(() => searchBooks("JavaScript")).toThrow(
      /Google Books API key is missing/,
    );
  });

  test("searchBooks throws if query is missing", () => {
    process.env.BOOKS_API_KEY = "test-key";
    expect(() => searchBooks("")).toThrow(
      /Query is required for searching books/,
    );
  });

  test("searchBooks returns API items array", async () => {
    process.env.BOOKS_API_KEY = "test-key";
    const items = [createBook(), createBook({ title: "Eloquent JavaScript" })];

    global.fetch = jest.fn(async (url) => {
      expect(url).toMatch(/q=JavaScript/);
      expect(url).toMatch(/key=test-key/);

      return {
        json: async () => ({ items }),
      };
    });

    const result = await searchBooks("JavaScript");
    expect(result).toHaveLength(2);
    expect(result).toEqual(items);
  });

  test("searchBooks encodes query text", async () => {
    process.env.BOOKS_API_KEY = "test-key";

    global.fetch = jest.fn(async (url) => {
      expect(url).toMatch(/q=clean%20code/);
      return {
        json: async () => ({ items: [createBook()] }),
      };
    });

    await searchBooks("clean code");
  });

  test("searchBooks returns empty array when API has no items", async () => {
    process.env.BOOKS_API_KEY = "test-key";

    global.fetch = jest.fn(async () => ({
      json: async () => ({}),
    }));

    const result = await searchBooks("missing");
    expect(result).toEqual([]);
  });

  test("searchBooks throws Rate Limit error when API returns 429 with text body", async () => {
    process.env.BOOKS_API_KEY = "test-key";

    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 429,
      json: async () => {
        throw new Error("invalid json");
      },
      text: async () => "Too Many Requests",
    }));

    await expect(searchBooks("limit")).rejects.toThrow(
      /Rate limit exceeded \(HTTP 429\): Too Many Requests/,
    );
  });

  test("searchBooks throws Access Denied error when API returns 403 with JSON body", async () => {
    process.env.BOOKS_API_KEY = "test-key";

    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: "API key not valid" } }),
      text: async () => "",
    }));

    await expect(searchBooks("denied")).rejects.toThrow(
      /Access denied \(HTTP 403\): API key not valid/,
    );
  });

  test("searchBooks throws generic API error when API returns 500 with JSON body", async () => {
    process.env.BOOKS_API_KEY = "test-key";

    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: "Something bad" }),
      text: async () => "",
    }));

    await expect(searchBooks("server")).rejects.toThrow(
      /Google Books API error \(HTTP 500\):/,
    );
  });

  test("searchBooks wraps network errors with a clear message", async () => {
    process.env.BOOKS_API_KEY = "test-key";

    global.fetch = jest.fn(() => Promise.reject(new Error("network down")));

    await expect(searchBooks("net")).rejects.toThrow(
      /Error fetching books: network down/,
    );
  });

  test("formatBook maps Google Books shape into simplified objects", () => {
    const result = formatBook([createBook()]);

    expect(result).toHaveLength(1);
    expect(Object.keys(result[0])).toEqual(EXPECTED_COLUMNS);
    expect(result[0].title).toBe("JavaScript: The Good Parts");
    expect(result[0].language).toBe("en");
  });

  test("formatBook keeps undefined values for missing fields", () => {
    const result = formatBook([
      createBook({ publisher: undefined, categories: undefined }),
    ]);

    expect(result[0]).toMatchObject({
      publisher: undefined,
      categories: undefined,
      title: "JavaScript: The Good Parts",
    });
  });

  test("formatBook throws on missing input", () => {
    expect(() => formatBook(null)).toThrow(/Error fetching book data/);
  });

  test("getColumnNamesFromBooks returns expected column names", () => {
    const result = getColumnNamesFromBooks([createBook()]);
    expect(result).toEqual(EXPECTED_COLUMNS);
  });

  test("getColumnNamesFromBooks returns empty array when no books found", () => {
    const result = getColumnNamesFromBooks([]);

    expect(result).toEqual([]);
  });

  test("column name flow from brief works with async search + formatting", async () => {
    process.env.BOOKS_API_KEY = "test-key";
    global.fetch = jest.fn(async () => ({
      json: async () => ({ items: [createBook()] }),
    }));

    const booksdata = await searchBooks("JavaScript");
    const formattedBooks = formatBook(booksdata);
    const columns = formattedBooks.length ? Object.keys(formattedBooks[0]) : [];

    expect(columns).toEqual(EXPECTED_COLUMNS);
  });
});
