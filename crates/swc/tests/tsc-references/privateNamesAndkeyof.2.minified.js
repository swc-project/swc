//// [privateNamesAndkeyof.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap();
class A {
    constructor(){
        _class_private_method_init(this, _fooMethod), _class_private_field_init(this, _fooProp, {
            get: get_fooProp,
            set: set_fooProp
        }), _class_private_field_init(this, _fooField, {
            writable: !0,
            value: 3
        }), this.bar = 3, this.baz = 3;
    }
}
function fooMethod() {}
function get_fooProp() {
    return 1;
}
function set_fooProp(value) {}
let k = "bar";
k = "baz", k = "#fooField", k = "#fooMethod", k = "#fooProp", k = "fooField", k = "fooMethod", k = "fooProp";
