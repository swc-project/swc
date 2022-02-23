function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _b = new WeakSet(), _c = new WeakSet();
export class C {
    constructor(){
        !function(obj, privateMap, value) {
            _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
        }(this, _a, {
            writable: !0,
            value: 1
        }), _classPrivateMethodInit(this, _b), _classPrivateMethodInit(this, _c);
    }
}
var _a = new WeakMap();
