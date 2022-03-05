import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
function f(t, u, v) {
    // ok
    var r = true ? t : u;
    var r = true ? u : t;
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
}
var B1 = function B1() {
    "use strict";
    swcHelpers.classCallCheck(this, B1);
};
var D1 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D1, B1);
    var _super = swcHelpers.createSuper(D1);
    function D1() {
        swcHelpers.classCallCheck(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(B1);
var D2 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D2, B1);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        swcHelpers.classCallCheck(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(B1);
var D3 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D3, B1);
    var _super = swcHelpers.createSuper(D3);
    function D3() {
        swcHelpers.classCallCheck(this, D3);
        return _super.apply(this, arguments);
    }
    return D3;
}(B1);
var D4 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D4, B1);
    var _super = swcHelpers.createSuper(D4);
    function D4() {
        swcHelpers.classCallCheck(this, D4);
        return _super.apply(this, arguments);
    }
    return D4;
}(B1);
var D5 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D5, B1);
    var _super = swcHelpers.createSuper(D5);
    function D5() {
        swcHelpers.classCallCheck(this, D5);
        return _super.apply(this, arguments);
    }
    return D5;
}(B1);
var D6 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D6, B1);
    var _super = swcHelpers.createSuper(D6);
    function D6() {
        swcHelpers.classCallCheck(this, D6);
        return _super.apply(this, arguments);
    }
    return D6;
}(B1);
var D7 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D7, B1);
    var _super = swcHelpers.createSuper(D7);
    function D7() {
        swcHelpers.classCallCheck(this, D7);
        return _super.apply(this, arguments);
    }
    return D7;
}(B1);
var D8 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D8, B1);
    var _super = swcHelpers.createSuper(D8);
    function D8() {
        swcHelpers.classCallCheck(this, D8);
        return _super.apply(this, arguments);
    }
    return D8;
}(B1);
var D9 = /*#__PURE__*/ function(B1) {
    "use strict";
    swcHelpers.inherits(D9, B1);
    var _super = swcHelpers.createSuper(D9);
    function D9() {
        swcHelpers.classCallCheck(this, D9);
        return _super.apply(this, arguments);
    }
    return D9;
}(B1);
