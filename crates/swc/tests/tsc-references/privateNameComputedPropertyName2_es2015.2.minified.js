let getX;
var tmp = (getX = (a)=>(function(receiver, privateMap) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver).value;
    })(a, _x)
, "_"), _x = new WeakMap();
console.log(getX(new class {
    [tmp]() {}
    constructor(){
        !function(obj, privateMap, value) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateMap), privateMap.set(obj, value);
        }(this, _x, {
            writable: !0,
            value: 100
        });
    }
}));
