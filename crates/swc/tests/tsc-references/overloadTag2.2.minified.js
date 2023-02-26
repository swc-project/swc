//// [overloadTag2.js]
export class Foo {
    #a = 1;
    #b;
    constructor(a, b){
        this.#a = a, this.#b = b;
    }
}
new Foo(), new Foo('str'), new Foo(2), new Foo('str', 2);
