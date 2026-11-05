class Foo extends Bar {
    #b;
    constructor(){
        super(), this.a = 1, this.#b = 2;
        console.log("constructor");
    }
    static{
        this.c = 3;
    }
    static #d = 4;
}
