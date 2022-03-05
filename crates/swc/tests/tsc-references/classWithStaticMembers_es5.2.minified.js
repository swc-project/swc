import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(a, b) {
        swcHelpers.classCallCheck(this, C), this.a = a, this.b = b;
    }
    return swcHelpers.createClass(C, null, [
        {
            key: "fn",
            value: function() {
                return this;
            }
        },
        {
            key: "x",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), C;
}(), r = C.fn();
r.x, r.foo;
var D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C), r = D.fn();
r.x, r.foo;
