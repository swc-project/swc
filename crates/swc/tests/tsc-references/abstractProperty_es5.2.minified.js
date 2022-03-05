import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function() {
                console.log(this.x);
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _this;
        return swcHelpers.classCallCheck(this, B), _this = _super.apply(this, arguments), _this.x = "B.x", _this;
    }
    return B;
}(A), C = function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(C, [
        {
            key: "x",
            get: function() {
                return "C.x";
            }
        }
    ]), C;
}(A);
