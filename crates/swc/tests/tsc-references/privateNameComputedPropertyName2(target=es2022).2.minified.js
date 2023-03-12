//// [privateNameComputedPropertyName2.ts]
let getX;
class A {
    #x;
    [(getX = (a)=>a.#x, "_")]() {}
    constructor(){
        this.#x = 100;
    }
}
console.log(getX(new A));
