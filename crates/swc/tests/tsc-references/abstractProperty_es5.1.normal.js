import * as swcHelpers from "@swc/helpers";
// @target: es2015,esnext
// @useDefineForClassFields: true
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {
        console.log(this.x);
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = "B.x";
        return _this;
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            key: "x",
            get: function get() {
                return "C.x";
            }
        }
    ]);
    return C;
}(A);
