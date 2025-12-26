//// [privateNameES5Ban.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _field = new WeakMap(), _method = new WeakSet(), _sField = new WeakMap(), _acc = new WeakMap(), _sAcc = new WeakMap(), A = function A() {
    _class_call_check(this, A), _method.add(this), _acc.set(this, {
        get: get_acc,
        set: set_acc
    }), _class_private_field_init(this, _field, {
        writable: !0,
        value: void 0
    }), _class_private_field_set(this, _field, 123);
};
function get_acc() {
    return "";
}
function set_acc(x) {}
_sAcc.set(A, {
    get: function() {
        return 0;
    },
    set: function(x) {}
}), _sField.set(A, {
    writable: !0,
    value: "hello world"
});
