import * as swcHelpers from "@swc/helpers";
var /**
     * @public
     */ _a = new WeakMap(), /**
     * @private
     */ _b = new WeakMap(), /**
     * @protected
     */ _c = new WeakMap(), /**
     * @public
     */ _aMethod = new WeakSet(), /**
     * @private
     */ _bMethod = new WeakSet(), /**
     * @protected
     */ _cMethod = new WeakSet(), _aProp = new WeakMap(), _bProp = new WeakMap(), _cProp = new WeakMap();
// @allowJs: true
// @checkJs: true
// @strict: true
// @target: es6
// @outDir: ./out
// @filename: privateNamesIncompatibleModifiersJs.js
class A {
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _aMethod);
        swcHelpers.classPrivateMethodInit(this, _bMethod);
        swcHelpers.classPrivateMethodInit(this, _cMethod);
        /**
     * @public
     */ swcHelpers.classPrivateFieldInit(this, _aProp, {
            get: get_aProp,
            set: /**
     * @public
     */ set_aProp
        });
        /**
     * @private
     */ swcHelpers.classPrivateFieldInit(this, _bProp, {
            get: get_bProp,
            set: /**
     * @private
     */ set_bProp
        });
        /**
    * @protected
    */ swcHelpers.classPrivateFieldInit(this, _cProp, {
            get: get_cProp,
            set: /**
     * @protected
     */ set_cProp
        });
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: true,
            value: 1
        });
        swcHelpers.classPrivateFieldInit(this, _b, {
            writable: true,
            value: 1
        });
        swcHelpers.classPrivateFieldInit(this, _c, {
            writable: true,
            value: 1
        });
    }
}
function aMethod() {
    return 1;
}
function bMethod() {
    return 1;
}
function cMethod() {
    return 1;
}
function get_aProp() {
    return 1;
}
function set_aProp(value) {}
function get_bProp() {
    return 1;
}
function set_bProp(value) {}
function get_cProp() {
    return 1;
}
function set_cProp(value) {}
