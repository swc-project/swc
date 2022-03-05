import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(A);
var a;
var b;
// Basic
if (isC(a)) {
    a.propC;
}
// Sub type
var subType;
if (isA(subType)) {
    subType.propC;
}
// Union type
var union;
if (isA(union)) {
    union.propA;
}
if (isC_multipleParams(a, 0)) {
    a.propC;
}
// Methods
var obj;
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    swcHelpers.createClass(D, [
        {
            key: "method1",
            value: function method1(p1) {
                return true;
            }
        }
    ]);
    return D;
}();
// Arrow function
var f1 = function(p1) {
    return false;
};
// Function expressions
f2(function(p1) {
    return true;
});
acceptingBoolean(isA(a));
acceptingTypeGuardFunction(isA);
// Binary expressions
var union2;
var union3 = isA(union2) || union2;
