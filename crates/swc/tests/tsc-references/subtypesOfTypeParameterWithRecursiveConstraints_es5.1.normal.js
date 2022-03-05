import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
function f(t, u, v) {
    // ok
    var r1 = true ? t : u;
    var r1 = true ? u : t;
    // ok
    var r2 = true ? t : v;
    var r2 = true ? v : t;
    // ok
    var r3 = true ? v : u;
    var r3 = true ? u : v;
    // ok
    var r4 = true ? t : new Foo();
    var r4 = true ? new Foo() : t;
    // ok
    var r5 = true ? u : new Foo();
    var r5 = true ? new Foo() : u;
    // ok
    var r6 = true ? v : new Foo();
    var r6 = true ? new Foo() : v;
    // ok
    var r7 = true ? t : new Foo();
    var r7 = true ? new Foo() : t;
    // ok
    var r8 = true ? u : new Foo();
    var r8 = true ? new Foo() : u;
    // ok
    var r9 = true ? v : new Foo();
    var r9 = true ? new Foo() : v;
    // ok
    var r10 = true ? t : new Foo();
    var r10 = true ? new Foo() : t;
    // ok
    var r11 = true ? u : new Foo();
    var r11 = true ? new Foo() : u;
    // ok
    var r12 = true ? v : new Foo();
    var r12 = true ? new Foo() : v;
}
var M1;
(function(M1) {
    var Base = function Base() {
        "use strict";
        swcHelpers.classCallCheck(this, Base);
    };
    var D1 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D1, Base);
        var _super = swcHelpers.createSuper(D1);
        function D1() {
            swcHelpers.classCallCheck(this, D1);
            return _super.apply(this, arguments);
        }
        return D1;
    }(Base);
    var D2 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D2, Base);
        var _super = swcHelpers.createSuper(D2);
        function D2() {
            swcHelpers.classCallCheck(this, D2);
            return _super.apply(this, arguments);
        }
        return D2;
    }(Base);
    var D3 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D3, Base);
        var _super = swcHelpers.createSuper(D3);
        function D3() {
            swcHelpers.classCallCheck(this, D3);
            return _super.apply(this, arguments);
        }
        return D3;
    }(Base);
    var D4 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D4, Base);
        var _super = swcHelpers.createSuper(D4);
        function D4() {
            swcHelpers.classCallCheck(this, D4);
            return _super.apply(this, arguments);
        }
        return D4;
    }(Base);
    var D5 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D5, Base);
        var _super = swcHelpers.createSuper(D5);
        function D5() {
            swcHelpers.classCallCheck(this, D5);
            return _super.apply(this, arguments);
        }
        return D5;
    }(Base);
    var D6 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D6, Base);
        var _super = swcHelpers.createSuper(D6);
        function D6() {
            swcHelpers.classCallCheck(this, D6);
            return _super.apply(this, arguments);
        }
        return D6;
    }(Base);
    var D7 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D7, Base);
        var _super = swcHelpers.createSuper(D7);
        function D7() {
            swcHelpers.classCallCheck(this, D7);
            return _super.apply(this, arguments);
        }
        return D7;
    }(Base);
    var D8 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D8, Base);
        var _super = swcHelpers.createSuper(D8);
        function D8() {
            swcHelpers.classCallCheck(this, D8);
            return _super.apply(this, arguments);
        }
        return D8;
    }(Base);
    var D9 = /*#__PURE__*/ function(Base) {
        "use strict";
        swcHelpers.inherits(D9, Base);
        var _super = swcHelpers.createSuper(D9);
        function D9() {
            swcHelpers.classCallCheck(this, D9);
            return _super.apply(this, arguments);
        }
        return D9;
    }(Base);
})(M1 || (M1 = {}));
var M2;
(function(M2) {
    var Base2 = function Base2() {
        "use strict";
        swcHelpers.classCallCheck(this, Base2);
    };
    var D1 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D1, Base2);
        var _super = swcHelpers.createSuper(D1);
        function D1() {
            swcHelpers.classCallCheck(this, D1);
            return _super.apply(this, arguments);
        }
        return D1;
    }(Base2);
    var D2 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D2, Base2);
        var _super = swcHelpers.createSuper(D2);
        function D2() {
            swcHelpers.classCallCheck(this, D2);
            return _super.apply(this, arguments);
        }
        return D2;
    }(Base2);
    var D3 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D3, Base2);
        var _super = swcHelpers.createSuper(D3);
        function D3() {
            swcHelpers.classCallCheck(this, D3);
            return _super.apply(this, arguments);
        }
        return D3;
    }(Base2);
    var D4 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D4, Base2);
        var _super = swcHelpers.createSuper(D4);
        function D4() {
            swcHelpers.classCallCheck(this, D4);
            return _super.apply(this, arguments);
        }
        return D4;
    }(Base2);
    var D5 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D5, Base2);
        var _super = swcHelpers.createSuper(D5);
        function D5() {
            swcHelpers.classCallCheck(this, D5);
            return _super.apply(this, arguments);
        }
        return D5;
    }(Base2);
    var D6 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D6, Base2);
        var _super = swcHelpers.createSuper(D6);
        function D6() {
            swcHelpers.classCallCheck(this, D6);
            return _super.apply(this, arguments);
        }
        return D6;
    }(Base2);
    var D7 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D7, Base2);
        var _super = swcHelpers.createSuper(D7);
        function D7() {
            swcHelpers.classCallCheck(this, D7);
            return _super.apply(this, arguments);
        }
        return D7;
    }(Base2);
    var D8 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D8, Base2);
        var _super = swcHelpers.createSuper(D8);
        function D8() {
            swcHelpers.classCallCheck(this, D8);
            return _super.apply(this, arguments);
        }
        return D8;
    }(Base2);
    var D9 = /*#__PURE__*/ function(Base2) {
        "use strict";
        swcHelpers.inherits(D9, Base2);
        var _super = swcHelpers.createSuper(D9);
        function D9() {
            swcHelpers.classCallCheck(this, D9);
            return _super.apply(this, arguments);
        }
        return D9;
    }(Base2);
})(M2 || (M2 = {}));
