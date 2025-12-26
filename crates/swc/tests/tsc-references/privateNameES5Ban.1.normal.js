//// [privateNameES5Ban.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _field = new WeakMap(), _method = new WeakSet(), _sField = new WeakMap(), _acc = new WeakMap(), _sAcc = new WeakMap();
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _method.add(this);
    _acc.set(this, {
        get: get_acc,
        set: set_acc
    });
    _class_private_field_init(this, _field, {
        writable: true,
        value: void 0
    });
    _class_private_field_set(this, _field, 123);
};
function method() {}
function sMethod() {}
function get_acc() {
    return "";
}
function set_acc(x) {}
function get_sAcc() {
    return 0;
}
function set_sAcc(x) {}
_sAcc.set(A, {
    get: get_sAcc,
    set: set_sAcc
});
_sField.set(A, {
    writable: true,
    value: "hello world"
});
