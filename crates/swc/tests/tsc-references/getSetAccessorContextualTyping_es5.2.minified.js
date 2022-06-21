import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "X",
            get: function() {
                return "string";
            },
            set: function(x) {}
        },
        {
            key: "Y",
            get: function() {
                return !0;
            },
            set: function(y) {}
        },
        {
            key: "W",
            get: function() {
                return !0;
            },
            set: function(w) {}
        },
        {
            key: "Z",
            get: function() {
                return 1;
            },
            set: function(z) {}
        }
    ]), C;
}();
