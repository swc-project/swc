let getX;
var tmp = (getX = (a)=>a.#x
, "_"), _x = new WeakMap();
console.log(getX(new class {
    [tmp]() {
    }
    constructor(){
        _x.set(this, {
            writable: !0,
            value: 100
        });
    }
}));
