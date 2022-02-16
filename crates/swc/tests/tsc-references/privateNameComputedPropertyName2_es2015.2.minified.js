let getX;
var tmp = (getX = (a)=>(function(receiver, privateMap) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver).value;
    })(a, _x)
, "_"), _x = new WeakMap();
console.log(getX(new class {
    [tmp]() {}
    constructor(){
        _x.set(this, {
            writable: !0,
            value: 100
        });
    }
}));
