import SearchBar from "./SearchBar/SearchBar.jsx";
import SearchResults from "./SearchResults/SearchResults.jsx";
import { useEffect, useMemo, useState } from "react";
import styles from "./Search.module.scss";
import cache from "../../utils/cache.js";
import DEFAULT_BOOK_COVER_IMAGE from "../../assets/BookCover.webp";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const hasResults = searchResults.length > 0;
  const [showCover, setShowCover] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (hasResults) {
      setIsOpening(true);

      const timer = setTimeout(() => {
        setShowCover(false);
        setIsOpening(false);
      }, 700);

      return () => clearTimeout(timer);
    }

    setShowCover(true);
    setIsOpening(false);
    return undefined;
  }, [hasResults]);

  // Keep one cache instance for the component lifetime so cached pages can be reused.
  const cacheInstance = useMemo(() => new cache(), []);

  return (
    <section className={styles.searchContainer}>
      <SearchBar
        setSearchResults={setSearchResults}
        cacheInstance={cacheInstance}
      />

      <div className={styles.resultsStage}>
        {showCover ? (
          <div
            className={`${styles.coverPanel} ${
              isOpening ? styles.coverPanelOpening : ""
            }`}
          >
            <img src={DEFAULT_BOOK_COVER_IMAGE} alt="Decorative book cover" />
          </div>
        ) : null}

        <SearchResults searchResults={searchResults} isOpening={isOpening} />
      </div>
    </section>
  );
}

export default Search;
