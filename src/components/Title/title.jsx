import styles from './title.module.scss';

function Title() {
  return (
    <>
      <div className={styles.titleContainer}>
        <h1>Google Books API Search</h1>
      </div>
    </>
  );
}

export default Title;
