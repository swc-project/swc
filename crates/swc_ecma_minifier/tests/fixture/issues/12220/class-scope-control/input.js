function F() {
    return (function() {
        return class {
            field = new.target;
            #field = (() => new.target)();
            static field = new.target;
            static #staticField = (() => new.target)();
            static { console.log(new.target === undefined); }
            check() { return this.field === undefined && this.#field === undefined; }
            static check() { return this.field === undefined && this.#staticField === undefined; }
        };
    })();
}
var C = new F();
console.log(C.check() && new C().check());
