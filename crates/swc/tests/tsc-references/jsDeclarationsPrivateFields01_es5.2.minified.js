import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
export var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), _class_private_method_init(this, _calcHello), _class_private_field_init(this, _screamingHello, {
            get: get_screamingHello,
            set: set_screamingHello
        }), _class_private_field_init(this, _hello, {
            writable: !0,
            value: "hello"
        }), _class_private_field_init(this, _world, {
            writable: !0,
            value: 100
        });
    }
    return C.prototype.getWorld = function() {
        return _class_private_field_get(this, _world);
    }, C;
}();
function get_screamingHello() {
    return _class_private_field_get(this, _hello).toUpperCase();
}
function set_screamingHello(value) {
    throw "NO";
}
