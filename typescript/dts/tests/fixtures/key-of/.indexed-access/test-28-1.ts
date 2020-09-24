function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

// Repros from #12011

class Base {
    get<K extends keyof this>(prop: K) {
        return this[prop];
    }

    set<K extends keyof this>(prop: K, value: this[K]) {
        this[prop] = value;
    }
}
