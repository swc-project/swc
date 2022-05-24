import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var /**
     * @public
     */ _a = /*#__PURE__*/ new WeakMap(), /**
     * @private
     */ _b = /*#__PURE__*/ new WeakMap(), /**
     * @protected
     */ _c = /*#__PURE__*/ new WeakMap(), /**
     * @public
     */ _aMethod = /*#__PURE__*/ new WeakSet(), /**
     * @private
     */ _bMethod = /*#__PURE__*/ new WeakSet(), /**
     * @protected
     */ _cMethod = /*#__PURE__*/ new WeakSet(), _aProp = /*#__PURE__*/ new WeakMap(), _bProp = /*#__PURE__*/ new WeakMap(), _cProp = /*#__PURE__*/ new WeakMap();
// @allowJs: true
// @checkJs: true
// @strict: true
// @target: es6
// @outDir: ./out
// @filename: privateNamesIncompatibleModifiersJs.js
class A {
    constructor(){
        _class_private_method_init(this, _aMethod);
        _class_private_method_init(this, _bMethod);
        _class_private_method_init(this, _cMethod);
        /**
     * @public
     */ _class_private_field_init(this, _aProp, {
            get: get_aProp,
            set: /**
     * @public
     */ set_aProp
        });
        /**
     * @private
     */ _class_private_field_init(this, _bProp, {
            get: get_bProp,
            set: /**
     * @private
     */ set_bProp
        });
        /**
    * @protected
    */ _class_private_field_init(this, _cProp, {
            get: get_cProp,
            set: /**
     * @protected
     */ set_cProp
        });
        _class_private_field_init(this, _a, {
            writable: true,
            value: 1
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: 1
        });
        _class_private_field_init(this, _c, {
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
