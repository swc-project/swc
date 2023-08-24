//// [overloadTag2.js]
export class Foo {
    #a;
    #b;
    /**
     * Should not have an implicit any error, because constructor's return type is always implicit
     * @constructor
     * @overload
     * @param {string} a
     * @param {number} b
     */ /**
     * @constructor
     * @overload
     * @param {number} a
     */ /**
     * @constructor
     * @overload
     * @param {string} a
     */ /**
     * @constructor
     * @param {number | string} a
     */ constructor(a, b){
        this.#a = 1, this.#a = a, this.#b = b;
    }
}
new Foo(), new Foo('str'), new Foo(2), new Foo('str', 2);
