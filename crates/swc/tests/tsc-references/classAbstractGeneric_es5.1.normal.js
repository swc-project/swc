import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error -- inherits abstract methods
(A);
var D = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(D, A);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
} // error -- inherits abstract methods
(A);
var E = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(E, A);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(E, [
        {
            key: "foo",
            value: function foo() {
                return this.t;
            }
        }
    ]);
    return E;
}(A);
var F = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(F, A);
    var _super = swcHelpers.createSuper(F);
    function F() {
        swcHelpers.classCallCheck(this, F);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(F, [
        {
            key: "bar",
            value: function bar(t) {}
        }
    ]);
    return F;
}(A);
var G = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(G, A);
    var _super = swcHelpers.createSuper(G);
    function G() {
        swcHelpers.classCallCheck(this, G);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(G, [
        {
            key: "foo",
            value: function foo() {
                return this.t;
            }
        },
        {
            key: "bar",
            value: function bar(t) {}
        }
    ]);
    return G;
}(A);
