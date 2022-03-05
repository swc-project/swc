import * as swcHelpers from "@swc/helpers";
var c, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        },
        {
            key: "foo",
            value: function() {}
        }
    ], [
        {
            key: "b",
            get: function() {
                return null;
            },
            set: function(x) {}
        },
        {
            key: "foo",
            value: function() {}
        }
    ]), C;
}();
c.x, c.y, c.y = 1, c.foo(), C.a, C.b(), C.b = 1, C.foo();
