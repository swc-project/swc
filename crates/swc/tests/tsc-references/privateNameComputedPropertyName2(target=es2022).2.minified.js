//// [privateNameComputedPropertyName2.ts]
let getX;
class A {
    #x = 100;
    [(getX = (a)=>a.#x, "_")]() {}
}
console.log(getX(new A));
