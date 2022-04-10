import * as swcHelpers from "@swc/helpers";
var c, C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function() {}, C.foo = function() {}, swcHelpers.createClass(C, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ], [
        {
            key: "b",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ]), C;
}();
c.x, c.y, c.y = 1, c.foo(), C.a, C.b(), C.b = 1, C.foo();
