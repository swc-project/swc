class Animal {
    readonly #name: string

    constructor(name: string) {
        this.#name = name
    }

    public noise() {
        return this.#name.toUpperCase()
    }
}