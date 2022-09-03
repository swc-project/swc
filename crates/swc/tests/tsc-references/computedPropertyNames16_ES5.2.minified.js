//// [computedPropertyNames16_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var s, n, a, C = function(_prop, _prop1, _prop2, _prop3) {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: s,
            get: function() {
                return 0;
            }
        },
        {
            key: n,
            set: function(v) {}
        },
        {
            key: _prop1,
            set: function(v) {}
        },
        {
            key: _prop2,
            get: function() {
                return 0;
            }
        },
        {
            key: 0,
            get: function() {
                return 0;
            }
        },
        {
            key: a,
            set: function(v) {}
        },
        {
            key: "hello bye",
            set: function(v) {}
        },
        {
            key: _prop3,
            get: function() {
                return 0;
            }
        }
    ], [
        {
            key: _prop,
            get: function() {
                return 0;
            }
        },
        {
            key: "",
            set: function(v) {}
        },
        {
            key: !0,
            get: function() {
                return 0;
            }
        }
    ]), C;
}(s + s, s + n, +s, "hello ".concat(a, " bye"));
