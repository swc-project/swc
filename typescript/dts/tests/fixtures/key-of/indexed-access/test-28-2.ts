
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
