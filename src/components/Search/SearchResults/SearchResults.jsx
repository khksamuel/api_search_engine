import Card from "../Card/Card.jsx";

function SearchResults({ searchResults }) {
  return (
    <div>
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
