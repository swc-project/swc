export class test {
    #throw() {}
    #new() {}
    test() {
        this.#throw();
        this.#new();
    }
}
