class Foo {
    // Move private class field init into constructor to preserve execution order
    #b;
    static{
        this.c = 3;
    }
    static #d = 4;
    constructor(){
        // Move class field into constructor
        this.a = 1;
        this.#b = 2;
    }
}
