class C {
    #a = 'a';

    constructor() {
        const a: typeof this.#a = ''; // Ok
        const b: typeof this.#a = 1;  // Error
    }
}