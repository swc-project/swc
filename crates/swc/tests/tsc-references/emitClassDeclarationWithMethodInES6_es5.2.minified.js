import * as swcHelpers from "@swc/helpers";
var D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function() {}
        },
        {
            key: "computedName1",
            value: function() {}
        },
        {
            key: "computedName2",
            value: function(a) {}
        },
        {
            key: "computedName3",
            value: function(a) {
                return 1;
            }
        },
        {
            key: "bar",
            value: function() {
                return this._bar;
            }
        },
        {
            key: "baz",
            value: function(a, x) {
                return "HELLO";
            }
        }
    ], [
        {
            key: "computedname4",
            value: function() {}
        },
        {
            key: "computedname5",
            value: function(a) {}
        },
        {
            key: "computedname6",
            value: function(a) {
                return !0;
            }
        },
        {
            key: "staticMethod",
            value: function() {
                return 3;
            }
        },
        {
            key: "foo",
            value: function(a) {}
        },
        {
            key: "bar",
            value: function(a) {
                return 1;
            }
        }
    ]), D;
}();
