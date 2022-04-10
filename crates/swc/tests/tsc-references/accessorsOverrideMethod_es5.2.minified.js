import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.m = function() {}, A;
}(), B = function(A) {
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(B, [
        {
            key: "m",
            get: function() {
                return function() {
                    return 1;
                };
            }
        }
    ]), B;
}(A);
