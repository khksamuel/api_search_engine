import Card from "../Card/Card.jsx";
import styles from "./SearchResults.module.scss";

function SearchResults({ searchResults }) {
  return (
    <div className={styles.searchResults}>
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
