import * as swcHelpers from "@swc/helpers";
var A = // @target: esnext
// @useDefineForClassFields: true
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "p",
            get: function get() {
                return 'oh no';
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B(p) {
        swcHelpers.classCallCheck(this, B);
        var _this;
        _this = _super.call(this);
        _this.p = p;
        return _this;
    }
    return B;
}(A);
