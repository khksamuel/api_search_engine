import "./DetailsDialog.scss";

function DetailsDialog({
  title,
  imageUrl,
  authors,
  publisher,
  description,
  pageCount,
  categories,
  averageRating,
  ratingsCount,
  language,
  previewLink,
}) {
  const authorText = authors?.length ? authors.join(", ") : "Unknown Author";
  const categoryText = categories?.length
    ? categories.join(", ")
    : "Uncategorised";
  const coverImage =
    imageUrl || "https://thumbs.dreamstime.com/b/old-book-cover-24489981.jpg";

  return (
    <div className="details-dialog">
      <form method="dialog" className="details-dialog__close-row">
        <button type="submit" className="details-dialog__close-button">
          Close
        </button>
      </form>

      <div className="details-dialog__layout">
        <img
          src={coverImage}
          alt={title || "Book cover"}
          className="details-dialog__image"
        />

        <div className="details-dialog__content">
          <p className="details-dialog__eyebrow">Book details</p>
          <h3 className="details-dialog__title">{title || "Untitled book"}</h3>
          <p className="details-dialog__authors">{authorText}</p>

          <dl className="details-dialog__meta">
            <div>
              <dt>Publisher</dt>
              <dd>{publisher || "Unknown"}</dd>
            </div>
            <div>
              <dt>Pages</dt>
              <dd>{pageCount || "Unknown"}</dd>
            </div>
            <div>
              <dt>Categories</dt>
              <dd>{categoryText}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>
                {averageRating ? `${averageRating} / 5` : "Not rated"}
                {ratingsCount ? ` (${ratingsCount} reviews)` : ""}
              </dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{language ? language.toUpperCase() : "Unknown"}</dd>
            </div>
          </dl>

          <p className="details-dialog__description">
            {description || "No description available for this book."}
          </p>

          {previewLink ? (
            <a
              className="details-dialog__preview-link"
              href={previewLink}
              target="_blank"
              rel="noreferrer"
            >
              Open preview
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DetailsDialog;
