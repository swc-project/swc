var _foo = new WeakSet();
new class {
    bar() {
        let x = function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            return descriptor.value = value, value;
        }(this, _foo, 84);
        console.log(x);
    }
    constructor(){
        !function(obj, privateSet) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateSet), privateSet.add(obj);
        }(this, _foo);
    }
}().bar();
