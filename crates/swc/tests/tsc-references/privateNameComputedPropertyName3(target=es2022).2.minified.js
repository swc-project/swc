//// [privateNameComputedPropertyName3.ts]
class Foo {
    #name;
    constructor(name){
        this.#name = name;
    }
    getValue(x) {
        class Bar {
            #y = 100;
            [this.#name]() {
                return x + this.#y;
            }
        }
        return new Bar()[this.#name]();
    }
}
console.log(new Foo("NAME").getValue(100));
