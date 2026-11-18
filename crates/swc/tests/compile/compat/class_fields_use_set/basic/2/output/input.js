class Foo extends Bar {
    #b;
    static{
        this.c = 3;
    }
    static #d = 4;
    constructor(...args){
        super(...args), this.a = 1, this.#b = 2;
    }
}
