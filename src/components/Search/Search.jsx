import SearchBar from "./SearchBar/SearchBar.jsx";
import SearchResults from "./SearchResults/SearchResults.jsx";
import { useMemo, useState } from "react";
import styles from "./Search.module.scss";
import cache from "../../utils/cache.js";
import DEFAULT_BOOK_COVER_IMAGE from "../../assets/BookCover.webp";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const hasResults = searchResults.length > 0;
  const searchBackgroundStyle = {
    backgroundImage: hasResults ? "none" : `url(${DEFAULT_BOOK_COVER_IMAGE})`,
  };
  // Keep one cache instance for the component lifetime so cached pages can be reused.
  const cacheInstance = useMemo(() => new cache(), []);

  return (
    <section className={styles.searchContainer} style={searchBackgroundStyle}>
      <SearchBar
        setSearchResults={setSearchResults}
        cacheInstance={cacheInstance}
      />
      <SearchResults searchResults={searchResults} />
    </section>
  );
}

export default Search;
