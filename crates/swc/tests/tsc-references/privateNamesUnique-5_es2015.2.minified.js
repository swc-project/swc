new WeakMap(), new class {
    constructor(){
        !function(obj, privateMap, value) {
            (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap), privateMap.set(obj, value);
        }(this, new WeakMap(), {
            writable: !0,
            value: void 0
        });
    }
}();
