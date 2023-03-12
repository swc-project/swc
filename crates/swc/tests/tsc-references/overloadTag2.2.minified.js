//// [overloadTag2.js]
export class Foo {
    #a;
    #b;
    constructor(a, b){
        this.#a = 1, this.#a = a, this.#b = b;
    }
}
new Foo(), new Foo('str'), new Foo(2), new Foo('str', 2);
