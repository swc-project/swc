//// [privateNameComputedPropertyName3.ts]
class Foo {
    #name;
    constructor(name){
        this.#name = name;
    }
    getValue(x) {
        const obj = this;
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
}
console.log(new Foo("NAME").getValue(100));
