import * as swcHelpers from "@swc/helpers";
var A = function A(x) {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    this.x = x;
    this.x = 0;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B(x) {
        swcHelpers.classCallCheck(this, B);
        var _this;
        _this = _super.call(this, x);
        // Fails, x is readonly
        _this.x = 1;
        return _this;
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C(x) {
        swcHelpers.classCallCheck(this, C);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        _this.x = 1;
        return _this;
    }
    return C;
}(A);
var D = function D(x) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.x = x;
    this.x = 0;
};
var E = // Fails, can't redeclare readonly property
/*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E(x) {
        swcHelpers.classCallCheck(this, E);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        _this.x = 1;
        return _this;
    }
    return E;
}(D);
