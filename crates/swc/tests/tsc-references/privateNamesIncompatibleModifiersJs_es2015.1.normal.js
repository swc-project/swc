function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var /**
     * @public
     */ _aMethod = new WeakSet(), /**
     * @private
     */ _bMethod = new WeakSet(), /**
     * @protected
     */ _cMethod = new WeakSet(), _aProp = new WeakSet(), _aProp = new WeakSet(), _bProp = new WeakSet(), _bProp = new WeakSet(), _cProp = new WeakSet(), _cProp = new WeakSet();
// @allowJs: true
// @checkJs: true
// @strict: true
// @target: es6
// @outDir: ./out
// @filename: privateNamesIncompatibleModifiersJs.js
class A {
    constructor(){
        _classPrivateFieldInit(this, /**
     * @public
     */ _a, {
            writable: true,
            value: 1
        });
        _classPrivateFieldInit(this, /**
     * @private
     */ _b, {
            writable: true,
            value: 1
        });
        _classPrivateFieldInit(this, /**
     * @protected
     */ _c, {
            writable: true,
            value: 1
        });
        _classPrivateMethodInit(this, _aMethod);
        _classPrivateMethodInit(this, _bMethod);
        _classPrivateMethodInit(this, _cMethod);
        /**
     * @public
     */ _classPrivateMethodInit(this, _aProp);
        /**
     * @public
     */ _classPrivateMethodInit(this, _aProp);
        /**
     * @private
     */ _classPrivateMethodInit(this, _bProp);
        /**
     * @private
     */ _classPrivateMethodInit(this, _bProp);
        /**
    * @protected
    */ _classPrivateMethodInit(this, _cProp);
        /**
     * @protected
     */ _classPrivateMethodInit(this, _cProp);
    }
}
var _a = new WeakMap();
var _b = new WeakMap();
var _c = new WeakMap();
function aMethod() {
    return 1;
}
function bMethod() {
    return 1;
}
function cMethod() {
    return 1;
}
function aProp() {
    return 1;
}
function aProp(value) {}
function bProp() {
    return 1;
}
function bProp(value) {}
function cProp() {
    return 1;
}
function cProp(value) {}
