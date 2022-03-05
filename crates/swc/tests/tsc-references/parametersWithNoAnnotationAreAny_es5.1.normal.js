import * as swcHelpers from "@swc/helpers";
function foo(x) {
    return x;
}
var f = function foo(x) {
    return x;
};
var f2 = function(x) {
    return x;
};
var f3 = function(x) {
    return x;
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(x) {
                return x;
            }
        }
    ]);
    return C;
}();
var a;
var b = {
    foo: function foo(x) {
        return x;
    },
    a: function foo(x) {
        return x;
    },
    b: function(x) {
        return x;
    }
};
