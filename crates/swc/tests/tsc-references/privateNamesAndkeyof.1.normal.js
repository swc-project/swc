//// [privateNamesAndkeyof.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap();
class A {
    constructor(){
        _fooMethod.add(this);
        _fooProp.set(this, {
            get: get_fooProp,
            set: set_fooProp
        });
        _class_private_field_init(this, _fooField, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _fooField, 3);
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
