import * as swcHelpers from "@swc/helpers";
var NonGeneric;
(function(NonGeneric) {
    var C = function C(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    var c = new C(); // error
    var c2 = new C(''); // ok
    var C2 = function C2(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        swcHelpers.inherits(D, C2);
        var _super = swcHelpers.createSuper(D);
        function D() {
            swcHelpers.classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(NonGeneric || (NonGeneric = {}));
var Generics;
(function(Generics) {
    var C = function C(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    var c = new C(); // error
    var c2 = new C(''); // ok
    var C2 = function C2(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1, 2); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        swcHelpers.inherits(D, C2);
        var _super = swcHelpers.createSuper(D);
        function D() {
            swcHelpers.classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(Generics || (Generics = {}));
