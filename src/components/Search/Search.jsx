import SearchBar from "./SearchBar/SearchBar.jsx";
import SearchResults from "./SearchResults/SearchResults.jsx";
import { useState } from "react";
import styles from "./Search.module.scss";
import DEFAULT_BOOK_COVER_IMAGE from "../../assets/BookCover.webp";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const hasResults = searchResults.length > 0;
  const searchBackgroundStyle = {
    backgroundImage: hasResults ? "none" : `url(${DEFAULT_BOOK_COVER_IMAGE})`,
  };

  return (
    <section className={styles.searchContainer} style={searchBackgroundStyle}>
      <SearchBar setSearchResults={setSearchResults} />
      <SearchResults searchResults={searchResults} />
    </section>
  );
}

export default Search;
