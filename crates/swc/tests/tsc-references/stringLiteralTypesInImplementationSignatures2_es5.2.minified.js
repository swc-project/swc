import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}();
swcHelpers.defineProperty({
    foo: function(x) {}
}, "foo", function(x) {});
