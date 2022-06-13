import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
//Cond ? Expr1 : Expr2,  Expr1 and Expr2 have no identical best common type
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
var A = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(A, X);
    var _super = _create_super(A);
    function A() {
        _class_call_check(this, A);
        return _super.apply(this, arguments);
    }
    return A;
}(X);
var B = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(B, X);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
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
