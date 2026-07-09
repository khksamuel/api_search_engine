import styles from './search_bar.module.scss';

function SearchBar() {
    return (
        <div className={styles.searchBar}>
            <input type="text" placeholder="Type your keyword..." />
            <button>Search</button>
        </div>
    );
}

export default SearchBar;