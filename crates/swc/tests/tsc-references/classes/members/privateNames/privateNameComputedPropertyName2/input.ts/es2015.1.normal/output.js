// @target: esnext, es2015
let getX;
var tmp = (getX = (a)=>a.#x
, "_");
class A {
    [tmp]() {
    }
    constructor(){
        _x.set(this, {
            writable: true,
            value: 100
        });
    }
}
var _x = new WeakMap();
console.log(getX(new A));
