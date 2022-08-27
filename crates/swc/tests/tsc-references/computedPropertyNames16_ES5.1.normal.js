//// [computedPropertyNames16_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var s;
var n;
var a;
var C = /*#__PURE__*/ function(_prop, _prop1, _prop2, _prop3) {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: s,
            get: function get() {
                return 0;
            }
        },
        {
            key: n,
            set: function set(v) {}
        },
        {
            key: _prop1,
            set: function set(v) {}
        },
        {
            key: _prop2,
            get: function get() {
                return 0;
            }
        },
        {
            key: 0,
            get: function get() {
                return 0;
            }
        },
        {
            key: a,
            set: function set(v) {}
        },
        {
            key: "hello bye",
            set: function set(v) {}
        },
        {
            key: _prop3,
            get: function get() {
                return 0;
            }
        }
    ], [
        {
            key: _prop,
            get: function get() {
                return 0;
            }
        },
        {
            key: "",
            set: function set(v) {}
        },
        {
            key: true,
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}(s + s, s + n, +s, "hello ".concat(a, " bye"));
