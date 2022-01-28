// @target: esnext, es2015

class Foo {
    #name;

    constructor(name) {
        this.#name = name;
    }

    getValue(x) {
        const obj = this;

        class Bar {
            #y = 100;

            [obj.#name]() {
                return x + this.#y;
            }
        }

        return new Bar()[obj.#name]();
    }
}

console.log(new Foo("NAME").getValue(100));
