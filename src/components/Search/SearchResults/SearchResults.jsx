import Card from "../Card/Card.jsx";
import styles from "./SearchResults.module.scss";

function SearchResults({ searchResults, isOpening }) {
  const hasResults = searchResults.length > 0;

  if (!hasResults) {
    return null;
  }

  return (
    <div
      className={`${styles.searchResults} ${styles.hasResults} ${
        isOpening ? styles.opening : ""
      }`}
    >
      {searchResults.map((result, index) => (
        <Card
          key={index}
          title={result.title}
          imageUrl={result.imageUrl}
          authors={result.authors}
          publisher={result.publisher}
          description={result.description}
          pageCount={result.pageCount}
          categories={result.categories}
          averageRating={result.averageRating}
          ratingsCount={result.ratingsCount}
          language={result.language}
          previewLink={result.previewLink}
        />
      ))}
    </div>
  );
}

export default SearchResults;
