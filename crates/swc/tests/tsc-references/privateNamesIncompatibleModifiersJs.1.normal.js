//// [privateNamesIncompatibleModifiersJs.js]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
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
class A {
    constructor(){
        _aMethod.add(this);
        _bMethod.add(this);
        _cMethod.add(this);
        /**
     * @public
     */ _aProp.set(this, {
            get: get_aProp,
            set: /**
     * @public
     */ set_aProp
        });
        /**
     * @private
     */ _bProp.set(this, {
            get: get_bProp,
            set: /**
     * @private
     */ set_bProp
        });
        /**
    * @protected
    */ _cProp.set(this, {
            get: get_cProp,
            set: /**
     * @protected
     */ set_cProp
        });
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _c, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _a, 1);
        _class_private_field_set(this, _b, 1);
        _class_private_field_set(this, _c, 1);
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
