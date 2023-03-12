//// [privateNameFieldsESNext.ts]
class C {
    #a;
    #b;
    method() {
        console.log(this.#a);
        this.#a = "hello";
        console.log(this.#b);
    }
    static #m = "test";
    static #x;
    static test() {
        console.log(this.#m);
        console.log(this.#x = "test");
    }
    #something;
    constructor(){
        this.a = 123;
        this.#a = 10;
        this.c = "hello";
        this.#something = ()=>1234;
    }
}
