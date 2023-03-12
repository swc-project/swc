class Foo extends Bar {
    a = 1;
    #b = 2;

    constructor() {
        super();
        console.log("constructor");
    }

    static c = 3;
    static #d = 4;
}
