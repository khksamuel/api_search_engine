import styles from "./Card.module.scss";
import DetailsDialog from "../DetailsDialog/DetailsDialog.jsx";
import DefaultBookCover from "../../../assets/BookCover.webp";
import { useRef } from "react";

function Card({
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
  // renders the imageUrl as an image if it exists, otherwise renders a placeholder image
  const renderImage = () => {
    if (imageUrl) {
      return <img src={imageUrl} alt={title} className={styles.cardImage} />;
    }
    return (
      <img
        src={DefaultBookCover}
        alt="Default book cover"
        className={styles.cardImage}
      />
    );
  };
  const renderDetailsDialog = () => {
    return (
      <DetailsDialog
        title={title}
        imageUrl={imageUrl || DefaultBookCover}
        authors={authors}
        publisher={publisher}
        description={description}
        pageCount={pageCount}
        categories={categories}
        averageRating={averageRating}
        ratingsCount={ratingsCount}
        language={language}
        previewLink={previewLink}
        onClick={() => dialogRef.current.showModal()}
      />
    );
  };
  // renders the image only by default and,
  // on hover, it dims the image and show the title and author of the book,
  // and a button trigger a dialog to view more details about the book
  const dialogRef = useRef(null);
  return (
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        {renderImage()}
        <div className={styles.cardOverlay}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardAuthors}>
            {authors ? authors.join(", ") : "Unknown Author"}
          </p>
          <button
            className={styles.cardButton}
            onClick={() => dialogRef.current.showModal()}
          >
            Details
          </button>
          <dialog ref={dialogRef} className={styles.cardDialog}>
            {renderDetailsDialog()}
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default Card;
