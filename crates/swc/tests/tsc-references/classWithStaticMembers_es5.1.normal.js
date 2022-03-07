import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(a, b) {
        swcHelpers.classCallCheck(this, C);
        this.a = a;
        this.b = b;
    }
    C.fn = function fn() {
        return this;
    };
    swcHelpers.createClass(C, null, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var r = C.fn();
var r2 = r.x;
var r3 = r.foo;
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
var r = D.fn();
var r2 = r.x;
var r3 = r.foo;
