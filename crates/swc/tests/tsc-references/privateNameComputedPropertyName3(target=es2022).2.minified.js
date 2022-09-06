//// [privateNameComputedPropertyName3.ts]
console.log(new class {
    #name;
    constructor(name){
        this.#name = name;
    }
    getValue(x) {
        let obj = this;
        class Bar {
            #y = 100;
            [obj.#name]() {
                return x + this.#y;
            }
        }
        return new Bar()[obj.#name]();
    }
}("NAME").getValue(100));
