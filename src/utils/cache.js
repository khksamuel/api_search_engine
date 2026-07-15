class cache {
    constructor() {
        this.store = new Map();
    }

    find(query, page = 1) {
        const key = `${query}-${page}`;
        return this.store.get(key);
    }

    save(query, page = 1, results) {
        const key = `${query}-${page}`;
        this.store.set(key, results);
    }
}

export default cache;