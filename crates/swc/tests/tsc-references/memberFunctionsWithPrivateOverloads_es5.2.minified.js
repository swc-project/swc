import * as swcHelpers from "@swc/helpers";
var c, d, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function(x, y) {}
        },
        {
            key: "bar",
            value: function(x, y) {}
        }
    ], [
        {
            key: "foo",
            value: function(x, y) {}
        },
        {
            key: "bar",
            value: function(x, y) {}
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function(x, y) {}
        },
        {
            key: "bar",
            value: function(x, y) {}
        }
    ], [
        {
            key: "foo",
            value: function(x, y) {}
        },
        {
            key: "bar",
            value: function(x, y) {}
        }
    ]), D;
}();
c.foo(1), d.foo(2), C.foo(1), D.bar("");
