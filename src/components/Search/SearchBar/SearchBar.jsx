import styles from "./SearchBar.module.scss";
import { useState } from "react";
import { searchBooks, formatBook } from "../../../utils/search.js";

const DESKTOP_RESULTS_PER_PAGE = 8;
const MOBILE_RESULTS_PER_PAGE = 4;

function getResultsPerPage() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches
  ) {
    return MOBILE_RESULTS_PER_PAGE;
  }

  return DESKTOP_RESULTS_PER_PAGE;
}

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [history, setHistory] = useState([]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
    setTotalPages(0);
    setPageInput("1");
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSearch = async (page = 1, searchQuery = query) => {
    const effectiveQuery = searchQuery.trim();

    try {
      const resultsPerPage = getResultsPerPage();
      // fetch search results from the API
      const data = await searchBooks(effectiveQuery, page, resultsPerPage);
      const formattedResults = formatBook(data.items);
      const pages = Math.ceil((data.totalItems || 0) / resultsPerPage);

      setErrorMessage("");
      setCurrentPage(page);
      setTotalPages(pages);
      setPageInput(String(page));
      setHistory((prevHistory) =>
        Array.from(new Set([effectiveQuery, ...prevHistory])).slice(0, 5),
      );
      setSearchResults(formattedResults);

      if (formattedResults.length === 0) {
        setErrorMessage("No results found. Please try a different query.");
      }
    } catch (error) {
      setCurrentPage(1);
      setTotalPages(0);
      setSearchResults([]);
      setErrorMessage(error.message || "Search failed. Please try again.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value.replace(/\D/g, ""));
  };

  const handlePageJump = () => {
    const requestedPage = Number(pageInput);
    if (!Number.isInteger(requestedPage) || requestedPage < 1) {
      setErrorMessage("Please enter a valid page number.");
      return;
    }
    if (requestedPage > totalPages) {
      handleSearch(totalPages);
      return;
    }

    handleSearch(requestedPage);
  };

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    const adjustedStart = Math.max(1, endPage - 2);

    return Array.from(
      { length: endPage - adjustedStart + 1 },
      (_, index) => adjustedStart + index,
    );
  };

  return (
    <div className={styles.SearchBar}>
      <form className={styles.searchControls} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Type here to search..."
          value={query}
          onChange={handleInputChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {/* buttons for history items */}
      <div>
        {history.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setQuery(item);
              handleSearch(1, item);
            }}
            className={styles.historyButton}
          >
            {item}
          </button>
        ))}
      </div>
      {errorMessage ? (
        <small className={styles.errorMessage}>{errorMessage}</small>
      ) : null}

      {totalPages > 1 ? (
        <div className={styles.pagination}>
          {getVisiblePages().map((pageNumber) => {
            return (
              <button
                key={pageNumber}
                type="button"
                className={`${styles.pageButton} ${
                  currentPage === pageNumber ? styles.activePage : ""
                }`}
                onClick={() => handleSearch(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
          <div className={styles.pageJump}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={handlePageInputChange}
              placeholder="Go to..."
              aria-label="Jump to page"
            />
            <button type="button" onClick={handlePageJump}>
              Go
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
