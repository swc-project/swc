var _ref, _method = new WeakSet();
class C {
    constructor(){
        !function(obj, privateSet) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateSet), privateSet.add(obj);
        }(this, _method);
    }
}
C.s = (function(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
})(_ref = new C(), _method, function() {
    return 42;
}).call(_ref), console.log(C.s);
