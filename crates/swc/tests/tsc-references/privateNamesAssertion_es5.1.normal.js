import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _p1 = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _p1, {
            writable: true,
            value: function(v) {
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
    var _proto = Foo.prototype;
    _proto.m1 = function m1(v) {
        _class_private_field_get(this, _p1).call(this, v);
        v;
    };
    return Foo;
}();
var _p11 = /*#__PURE__*/ new WeakSet();
var Foo2 = /*#__PURE__*/ function() {
    "use strict";
    function Foo2() {
        _class_call_check(this, Foo2);
        _class_private_method_init(this, _p11);
    }
    var _proto = Foo2.prototype;
    _proto.m1 = function m1(v) {
        _class_private_method_get(this, _p11, p1).call(this, v);
        v;
    };
    return Foo2;
}();
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
