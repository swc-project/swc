import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.self = function self() {
        return this;
    };
    return A;
}();
function f(x1) {
    var g = function g(x) {
        x = x.self();
    };
    x1 = x1.self();
}
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    var _proto = B.prototype;
    _proto.foo = function foo(x) {
        x = x.self();
    };
    _proto.bar = function bar(x) {
        x = x.self();
    };
    return B;
}();
