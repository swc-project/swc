import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "p",
            get: function() {
                return "oh no";
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _this;
        return swcHelpers.classCallCheck(this, B), _this = _super.apply(this, arguments), _this.p = "yep", _this;
    }
    return B;
}(A), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this._secret = 11;
    }
    return swcHelpers.createClass(C, [
        {
            key: "p",
            get: function() {
                return this._secret;
            },
            set: function(value) {
                this._secret = value;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.p = 101, _this;
    }
    return D;
}(C);
