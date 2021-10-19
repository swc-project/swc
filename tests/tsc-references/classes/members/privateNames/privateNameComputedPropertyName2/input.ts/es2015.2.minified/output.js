let getX;
var tmp = (getX = (a)=>a.#x
, "_");
console.log(getX(new class {
    [tmp]() {
    }
    constructor(){
        new WeakMap().set(this, {
            writable: !0,
            value: 100
        });
    }
}));
