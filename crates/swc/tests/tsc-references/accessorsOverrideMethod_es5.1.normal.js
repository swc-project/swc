import * as swcHelpers from "@swc/helpers";
var A = // @target: esnext
// @useDefineForClassFields: true
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.m = function m() {};
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(B, [
        {
            key: "m",
            get: function get() {
                return function() {
                    return 1;
                };
            }
        }
    ]);
    return B;
}(A);
