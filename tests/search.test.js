import fs from "fs";

import {
  getBooksApiKey,
  searchBooks,
  formatBook,
  getColumnNamesFromBooks,
} from "../src/utils/search.js";

const EXPECTED_COLUMNS = [
  "title",
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

let originalReadFileSync;
let originalFetch;
let originalExistsSync;

describe("Google Books helpers", () => {
  beforeEach(() => {
    originalReadFileSync = fs.readFileSync;
    originalFetch = global.fetch;
    originalExistsSync = fs.existsSync;
    fs.existsSync = jest.fn(() => true);
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
    global.fetch = originalFetch;
    fs.existsSync = originalExistsSync;
  });

  test("getBooksApiKey reads BOOKS_API_KEY from .env content", () => {
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key-123");

    expect(getBooksApiKey()).toBe("test-key-123");
  });

  test("getBooksApiKey throws if .env file is empty", () => {
    fs.readFileSync = jest.fn(() => "");

    expect(() => getBooksApiKey()).toThrow(
      /.env file is empty, please follow template in .env.example/,
    );
  });

  test("getBooksApiKey throws if .env file is missing", () => {
    fs.existsSync = jest.fn(() => false);

    expect(() => getBooksApiKey()).toThrow(
      /.env file not found, please create one with your BOOKS_API_KEY following the instructions in the README/,
    );
  });

  test("getBooksApiKey strips wrapping quotes", () => {
    fs.readFileSync = jest.fn(() => 'BOOKS_API_KEY="quoted-key"');

    expect(getBooksApiKey()).toBe("quoted-key");
  });

  test("getBooksApiKey throws if BOOKS_API_KEY is missing", () => {
    fs.readFileSync = jest.fn(() => "SOME_OTHER_KEY=value");

    expect(() => getBooksApiKey()).toThrow(
      /BOOKS_API_KEY was not found in \.env/,
    );
  });

  test("searchBooks throws if BOOKS_API_KEY is missing", () => {
    fs.readFileSync = jest.fn(() => "SOME_OTHER_KEY=value");
    expect(() => searchBooks("JavaScript")).toThrow(
      /BOOKS_API_KEY was not found in \.env/,
    );
  });

  test("searchBooks throws if query is missing", () => {
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");
    expect(() => searchBooks("")).toThrow(
      /Query is required for searching books/,
    );
  });

  test("searchBooks returns API items array", async () => {
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");
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
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");

    global.fetch = jest.fn(async (url) => {
      expect(url).toMatch(/q=clean%20code/);
      return {
        json: async () => ({ items: [createBook()] }),
      };
    });

    await searchBooks("clean code");
  });

  test("searchBooks returns empty array when API has no items", async () => {
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");

    global.fetch = jest.fn(async () => ({
      json: async () => ({}),
    }));

    const result = await searchBooks("missing");
    expect(result).toEqual([]);
  });

  test("searchBooks throws Rate Limit error when API returns 429 with text body", async () => {
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");

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
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");

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
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");

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
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");

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
    fs.readFileSync = jest.fn(() => "BOOKS_API_KEY=test-key");
    global.fetch = jest.fn(async () => ({
      json: async () => ({ items: [createBook()] }),
    }));

    const booksdata = await searchBooks("JavaScript");
    const formattedBooks = formatBook(booksdata);
    const columns = formattedBooks.length ? Object.keys(formattedBooks[0]) : [];

    expect(columns).toEqual(EXPECTED_COLUMNS);
  });
});
