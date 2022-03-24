import * as swcHelpers from "@swc/helpers";
// @target: es2015
// @useDefineForClassFields: true
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "p",
            get: function get() {
                return "oh no";
            }
        }
    ]);
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
        _this.p = "yep" // error
        ;
        return _this;
    }
    return B;
}(A);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this._secret = 11;
    }
    swcHelpers.createClass(C, [
        {
            key: "p",
            get: function get() {
                return this._secret;
            },
            set: function set(value) {
                this._secret = value;
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.p = 101 // error
        ;
        return _this;
    }
    return D;
}(C);
