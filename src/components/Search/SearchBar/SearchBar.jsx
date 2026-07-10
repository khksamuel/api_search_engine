import styles from "./SearchBar.module.scss";
import { useState } from "react";
import { searchBooks, formatBook } from "../../../utils/search.js";

function SearchBar({ setSearchResults }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    // fetch search results from the API
    const results = await searchBooks(query);
    const formattedResults = formatBook(results);
    setSearchResults(formattedResults);
  };

  return (
    <div className={styles.SearchBar}>
      <input
        type="text"
        placeholder="Type here to search..."
        value={query}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
