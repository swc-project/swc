import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.a = "", this.b = "", this.d = function() {
            return "";
        };
    }
    return swcHelpers.createClass(C, [
        {
            key: "c",
            value: function() {
                return "";
            }
        }
    ], [
        {
            key: "f",
            value: function() {
                return "";
            }
        }
    ]), C;
}();
C.g = function() {
    return "";
};
var D = function(C1) {
    "use strict";
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(D, [
        {
            key: "method",
            value: function() {
                var d = new D();
                d.x, d.a, d.b, d.c(), d.d(), C.e, C.f(), C.g();
            }
        }
    ]), D;
}(C);
