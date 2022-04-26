class Animal {
    #name;

    constructor(name) {
        this.#name = name
    }

    noise() {
        return this.#name.toUpperCase()
    }
}