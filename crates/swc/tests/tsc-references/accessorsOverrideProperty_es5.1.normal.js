import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    this.p = 'yep';
};
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
            key: "p",
            get: function get() {
                return 'oh no';
            } // error
        }
    ]);
    return B;
}(A);
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.p = 101;
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this._secret = 11;
        return _this;
    }
    swcHelpers.createClass(D, [
        {
            key: "p",
            get: function get() {
                return this._secret;
            } // error
            ,
            set: function set(value) {
                this._secret = value;
            } // error
        }
    ]);
    return D;
}(C);
