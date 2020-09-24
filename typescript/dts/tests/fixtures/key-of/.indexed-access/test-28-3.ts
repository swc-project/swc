function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
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
