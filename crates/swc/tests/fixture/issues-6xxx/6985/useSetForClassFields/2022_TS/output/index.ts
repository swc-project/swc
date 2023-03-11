class Foo {
    #b;
    static{
        this.c = 3;
    }
    static #d = 4;
    constructor(foo){
        this.foo = foo;
        this.a = 1;
        this.#b = 2;
    }
}
