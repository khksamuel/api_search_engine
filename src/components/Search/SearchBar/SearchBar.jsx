import styles from './SearchBar.module.scss';

function SearchBar() {
    return (
        <div className={styles.SearchBar}>
            <input type="text" placeholder="Type your keyword..." />
            <button>Search</button>
        </div>
    );
}

export default SearchBar;