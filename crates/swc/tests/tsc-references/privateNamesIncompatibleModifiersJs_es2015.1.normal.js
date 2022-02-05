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
        /**
     * @public
     */ _a.set(this, {
            writable: true,
            value: 1
        });
        /**
     * @private
     */ _b.set(this, {
            writable: true,
            value: 1
        });
        /**
     * @protected
     */ _c.set(this, {
            writable: true,
            value: 1
        });
        _aMethod.add(this);
        _bMethod.add(this);
        _cMethod.add(this);
        /**
     * @public
     */ _aProp.add(this);
        /**
     * @public
     */ _aProp.add(this);
        /**
     * @private
     */ _bProp.add(this);
        /**
     * @private
     */ _bProp.add(this);
        /**
    * @protected
    */ _cProp.add(this);
        /**
     * @protected
     */ _cProp.add(this);
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
