import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "name",
            get: function() {
                return this._name;
            }
        },
        {
            key: "computedname1",
            get: function() {
                return "";
            }
        },
        {
            key: "computedname2",
            get: function() {
                return "";
            }
        },
        {
            key: "computedname3",
            set: function(x) {}
        },
        {
            key: "computedname4",
            set: function(y) {}
        },
        {
            key: "foo",
            set: function(a) {}
        }
    ], [
        {
            key: "name2",
            get: function() {
                return "BYE";
            }
        },
        {
            key: "computedname",
            get: function() {
                return "";
            }
        },
        {
            key: "bar",
            set: function(b) {}
        },
        {
            key: "computedname",
            set: function(b) {}
        }
    ]), C;
}();
