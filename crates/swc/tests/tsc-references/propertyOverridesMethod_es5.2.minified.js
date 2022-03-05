import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "m",
            value: function() {}
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _this;
        return swcHelpers.classCallCheck(this, B), _this = _super.apply(this, arguments), _this.m = function() {
            return 1;
        }, _this;
    }
    return B;
}(A);
