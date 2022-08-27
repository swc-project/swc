//// [privateNameComputedPropertyName3.ts]
console.log(new class {
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
}("NAME").getValue(100));
