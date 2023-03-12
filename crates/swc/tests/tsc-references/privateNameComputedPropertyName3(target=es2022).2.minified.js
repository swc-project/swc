//// [privateNameComputedPropertyName3.ts]
console.log(new class {
    #name;
    constructor(name){
        this.#name = name;
    }
    getValue(x) {
        let obj = this;
        class Bar {
            #y;
            [obj.#name]() {
                return x + this.#y;
            }
            constructor(){
                this.#y = 100;
            }
        }
        return new Bar()[obj.#name]();
    }
}("NAME").getValue(100));
