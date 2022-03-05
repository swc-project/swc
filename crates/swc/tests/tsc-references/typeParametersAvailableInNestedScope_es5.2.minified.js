import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.x = function(a) {};
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {}
        }
    ]), C;
}(), c = new C();
c.data = c.x(null), c.data = c.foo();
