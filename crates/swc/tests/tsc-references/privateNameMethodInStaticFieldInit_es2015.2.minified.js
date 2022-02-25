var _method = new WeakSet();
class C {
    constructor(){
        !function(obj, privateSet) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateSet), privateSet.add(obj);
        }(this, _method);
    }
}
C.s = new C().#method(), console.log(C.s);
