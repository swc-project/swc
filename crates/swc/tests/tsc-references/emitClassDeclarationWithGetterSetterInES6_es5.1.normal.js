import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target:es6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "name",
            get: function get() {
                return this._name;
            }
        },
        {
            key: "computedname1",
            get: function get() {
                return "";
            }
        },
        {
            key: "computedname2",
            get: function get() {
                return "";
            }
        },
        {
            key: "computedname3",
            set: function set(x) {}
        },
        {
            key: "computedname4",
            set: function set(y) {}
        },
        {
            key: "foo",
            set: function set(a) {}
        }
    ], [
        {
            key: "name2",
            get: function get() {
                return "BYE";
            }
        },
        {
            key: "computedname",
            get: function get() {
                return "";
            }
        },
        {
            key: "bar",
            set: function set(b) {}
        },
        {
            key: "computedname",
            set: function set(b) {}
        }
    ]);
    return C;
}();
