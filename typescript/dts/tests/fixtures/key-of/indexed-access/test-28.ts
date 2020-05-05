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

class Person extends Base {
    parts: number;

    constructor(parts: number) {
        super();
        this.set("parts", parts);
    }

    getParts() {
        return this.get("parts")
    }
}

class OtherPerson {
    parts: number;

    constructor(parts: number) {
        setProperty(this, "parts", parts);
    }

    getParts() {
        return getProperty(this, "parts")
    }
}
