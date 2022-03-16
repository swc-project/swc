import * as swcHelpers from "@swc/helpers";
//Cond ? Expr1 : Expr2,  Expr1 and Expr2 have no identical best common type
var X = function X() {
    "use strict";
    swcHelpers.classCallCheck(this, X);
};
var A = /*#__PURE__*/ function(X) {
    "use strict";
    swcHelpers.inherits(A, X);
    var _super = swcHelpers.createSuper(A);
    function A() {
        swcHelpers.classCallCheck(this, A);
        return _super.apply(this, arguments);
    }
    return A;
}(X);
var B = /*#__PURE__*/ function(X) {
    "use strict";
    swcHelpers.inherits(B, X);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(X);
var x;
var a;
var b;
// No errors anymore, uses union types
true ? a : b;
var result1 = true ? a : b;
//Be contextually typed and and bct is not identical, results in errors that union type is not assignable to target
var result2 = true ? a : b;
var result3 = true ? a : b;
var result31 = true ? a : b;
var result4 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
var result5 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
var result6 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
var result61 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
