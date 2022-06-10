import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var s, n, a, C = function() {
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
            key: s + n,
            set: function(v) {}
        },
        {
            key: +s,
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
            key: "hello ".concat(a, " bye"),
            get: function() {
                return 0;
            }
        }
    ], [
        {
            key: s + s,
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
}();
