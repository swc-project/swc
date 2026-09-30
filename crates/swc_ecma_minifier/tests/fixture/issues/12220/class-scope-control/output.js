function F() {
    return class {
        field = new.target;
        #field = new.target;
        static field = new.target;
        static #staticField = new.target;
        static{
            console.log(new.target === void 0);
        }
        check() {
            return void 0 === this.field && void 0 === this.#field;
        }
        static check() {
            return void 0 === this.field && void 0 === this.#staticField;
        }
    };
}
var C = new F();
console.log(C.check() && new C().check());
