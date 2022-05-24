import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _fooField = /*#__PURE__*/ new WeakMap(), _fooMethod = /*#__PURE__*/ new WeakSet(), _fooProp = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(){
        _class_private_method_init(this, _fooMethod);
        _class_private_field_init(this, _fooProp, {
            get: get_fooProp,
            set: set_fooProp
        });
        _class_private_field_init(this, _fooField, {
            writable: true,
            value: 3
        });
        this.bar = 3;
        this.baz = 3;
    }
}
function fooMethod() {}
function get_fooProp() {
    return 1;
}
function set_fooProp(value) {}
// `keyof A` should not include '#foo*'
let k = "bar"; // OK
k = "baz"; // OK
k = "#fooField"; // Error
k = "#fooMethod"; // Error
k = "#fooProp"; // Error
k = "fooField"; // Error
k = "fooMethod"; // Error
k = "fooProp"; // Error
