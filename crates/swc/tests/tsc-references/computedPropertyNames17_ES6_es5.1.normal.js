import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @target: es6
var b;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: b,
            get: function get() {
                return 0;
            }
        },
        {
            key: [],
            get: function get() {
                return 0;
            }
        },
        {
            key: {},
            set: function set(v) {}
        },
        {
            key: null,
            set: function set(v) {}
        }
    ], [
        {
            key: true,
            set: function set(v) {}
        },
        {
            key: undefined,
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
