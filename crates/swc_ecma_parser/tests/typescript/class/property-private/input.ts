class MyClass {
    #a = 0;
    #b: string;

    constructor() {
        this.#b = "test";
    }

    method() {
        return #a in this;
    }
}
