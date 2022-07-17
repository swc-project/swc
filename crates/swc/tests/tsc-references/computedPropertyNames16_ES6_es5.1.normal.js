// @target: es6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var s;
var n;
var a;
var C = /*#__PURE__*/ function() {
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
            key: s + n,
            set: function set(v) {}
        },
        {
            key: +s,
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
            key: "hello ".concat(a, " bye"),
            get: function get() {
                return 0;
            }
        }
    ], [
        {
            key: s + s,
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
}();
