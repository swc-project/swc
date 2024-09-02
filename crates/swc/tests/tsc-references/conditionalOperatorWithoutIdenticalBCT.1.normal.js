//// [conditionalOperatorWithoutIdenticalBCT.ts]
//Cond ? Expr1 : Expr2,  Expr1 and Expr2 have no identical best common type
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
var A = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(A, X);
    function A() {
        _class_call_check(this, A);
        return _call_super(this, A, arguments);
    }
    return A;
}(X);
var B = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(B, X);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
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
