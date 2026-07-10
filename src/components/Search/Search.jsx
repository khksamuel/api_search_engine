import SearchBar from "./SearchBar/SearchBar.jsx";
import SearchResults from "./SearchResults/SearchResults.jsx";
import { useState } from "react";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div>
      <SearchBar setSearchResults={setSearchResults} />
      <SearchResults searchResults={searchResults} />
    </div>
  );
}

export default Search;
