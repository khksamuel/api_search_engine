import styles from "./SearchBar.module.scss";
import { useState } from "react";
import { searchBooks, formatBook } from "../../../utils/search.js";

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSearch = async () => {
    try {
      // fetch search results from the API
      const results = await searchBooks(query);
      const formattedResults = formatBook(results);
      setErrorMessage("");
      setSearchResults(formattedResults);
      if (formattedResults.length === 0) {
        setErrorMessage("No results found. Please try a different query.");
      }
    } catch (error) {
      setSearchResults([]);
      setErrorMessage(error.message || "Search failed. Please try again.");
    }
  };

  return (
    <div className={styles.SearchBar}>
      <div className={styles.searchControls}>
        <input
          type="text"
          placeholder="Type here to search..."
          value={query}
          onChange={handleInputChange}
        />
          <button onClick={handleSearch}>Search</button>
      </div>
      {errorMessage ? (
        <small className={styles.errorMessage}>{errorMessage}</small>
      ) : null}
    </div>
  );
}

export default SearchBar;
