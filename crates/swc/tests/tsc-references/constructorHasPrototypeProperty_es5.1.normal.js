import * as swcHelpers from "@swc/helpers";
var NonGeneric;
(function(NonGeneric) {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
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
    var r = C.prototype;
    r.foo;
    var r2 = D.prototype;
    r2.bar;
})(NonGeneric || (NonGeneric = {}));
var Generic;
(function(Generic) {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
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
    var r = C.prototype; // C<any, any>
    var ra = r.foo; // any
    var r2 = D.prototype; // D<any, any>
    var rb = r2.baz; // any
})(Generic || (Generic = {}));
