import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A), this.p = 'yep';
}, B = function(A1) {
    "use strict";
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(B, [
        {
            key: "p",
            get: function() {
                return 'oh no';
            }
        }
    ]), B;
}(A), C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C), this.p = 101;
}, D = function(C1) {
    "use strict";
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this._secret = 11, _this;
    }
    return swcHelpers.createClass(D, [
        {
            key: "p",
            get: function() {
                return this._secret;
            },
            set: function(value) {
                this._secret = value;
            }
        }
    ]), D;
}(C);
