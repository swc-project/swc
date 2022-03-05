import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "self",
            value: function self() {
                return this;
            }
        }
    ]);
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
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo(x) {
                x = x.self();
            }
        },
        {
            key: "bar",
            value: function bar(x) {
                x = x.self();
            }
        }
    ]);
    return B;
}();
