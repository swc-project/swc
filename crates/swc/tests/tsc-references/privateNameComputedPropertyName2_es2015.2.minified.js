let getX;
var _x = new WeakMap();
let tmp = (getX = (a)=>(function(receiver, privateMap) {
        var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver);
        }(receiver, privateMap, "get");
        return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
    })(a, _x)
, "_");
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
