function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _brand_check_brand = new WeakSet();
// @strict: true
// @noUnusedLocals: true
// @target: esnext, es2022
class Foo {
    isFoo(v) {
        // This should count as using/reading '#brand'
        return _brand_check_brand.has(v);
    }
    constructor(){
        _classPrivateFieldInit(this, _unused, {
            writable: true,
            value: void 0 // expect unused error
        });
        _classPrivateFieldInit(this, _brand, {
            writable: true,
            value: void _brand_check_brand.add(this)
        });
    }
}
var _unused = new WeakMap();
var _brand = new WeakMap();
